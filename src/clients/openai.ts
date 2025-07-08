import OpenAI from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createInterface } from "readline/promises";
import dotenv from "dotenv";
import { MCPClientBase, MCPTool, MCPClientConfig } from "../types/index.js";
import { getScriptCommand, validateApiKey, formatToolsList } from "../utils/index.js";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

class MCPClientOpenAI extends MCPClientBase {
  private openai: OpenAI;
  private openaiTools: any[] = [];

  constructor() {
    super({ name: "mcp-client-cli-openai", version: "1.0.0" });
    this.openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });
    this.mcp = new Client(this.config);
  }

  async connectToServer(serverScriptPath: string) {
    try {
      const command = getScriptCommand(serverScriptPath);
      
      this.transport = new StdioClientTransport({
        command,
        args: [serverScriptPath],
      });
      this.mcp.connect(this.transport);
      
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools;
      this.openaiTools = toolsResult.tools.map((tool: any) => {
        return {
          type: "function",
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          },
        };
      });
      console.log(
        "已连接到服务器，可用工具：",
        this.tools.map(({ name }) => name).join(", ")
      );
    } catch (e) {
      console.log("无法连接到 MCP 服务器: ", e);
      throw e;
    }
  }

  async processQuery(query: string) {
    const messages: any[] = [
      {
        role: "user",
        content: query,
      },
    ];
  
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      tools: this.openaiTools,
      max_tokens: 1000,
      store: true,
    });
  
    const finalText = [];
    const message = response.choices[0].message;
  
    if (message.content) {
      finalText.push(message.content);
    }
  
    if (message.tool_calls) {
      for (const toolCall of message.tool_calls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments);
  
        const result = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgs,
        });
        
        finalText.push(
          `[调用工具 ${toolName}，参数 ${JSON.stringify(toolArgs)}]`
        );
  
        messages.push({
          role: "assistant",
          content: message.content || "",
          tool_calls: message.tool_calls,
        });
  
        messages.push({
          role: "tool",
          content: typeof result.content === 'string' ? result.content : JSON.stringify(result.content),
          tool_call_id: toolCall.id,
        });
  
        const followUpResponse = await this.openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          max_tokens: 1000,
          store: true,
        });
  
        const followUpMessage = followUpResponse.choices[0].message;
        if (followUpMessage.content) {
          finalText.push(followUpMessage.content);
        }
      }
    }
  
    return finalText.join("\n");
  }

  async chatLoop() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    try {
      console.log("\nMCP 客户端已启动！(使用 OpenAI API)");
      console.log("输入你的查询或输入 'quit' 退出。");
  
      while (true) {
        const message = await rl.question("\n查询: ");
        if (message.toLowerCase() === "quit") {
          break;
        }
        const response = await this.processQuery(message);
        console.log("\n" + response);
      }
    } finally {
      rl.close();
    }
  }
  
  async cleanup() {
    await this.mcp.close();
  }
}

async function main() {
    if (process.argv.length < 3) {
      console.log("使用方法: node index-openai.js <path_to_server_script>");
      return;
    }
    const mcpClient = new MCPClientOpenAI();
    try {
      await mcpClient.connectToServer(process.argv[2]);
      await mcpClient.chatLoop();
    } finally {
      await mcpClient.cleanup();
      process.exit(0);
    }
  }
  
  main(); 