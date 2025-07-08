import { Anthropic } from "@anthropic-ai/sdk";
import {
  MessageParam,
  Tool,
} from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createInterface } from "readline/promises";
import dotenv from "dotenv";
import { MCPClientBase, MCPTool, MCPClientConfig } from "../types/index.js";
import { getScriptCommand, validateApiKey, formatToolsList } from "../utils/index.js";

dotenv.config();

const ANTHROPIC_API_KEY = validateApiKey(process.env.ANTHROPIC_API_KEY, "ANTHROPIC");

class MCPClient extends MCPClientBase {
  private anthropic: Anthropic;
  private anthropicTools: Tool[] = [];

  constructor() {
    super({ name: "mcp-client-cli", version: "1.0.0" });
    this.anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });
    this.mcp = new Client(this.config);
  }
  // 方法将在这里添加

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
      this.anthropicTools = toolsResult.tools.map((tool: any) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
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
    const messages: MessageParam[] = [
      {
        role: "user",
        content: query,
      },
    ];
  
    const response = await this.anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1000,
      messages,
      tools: this.anthropicTools,
    });
  
    const finalText = [];
    const toolResults = [];
  
    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool_use") {
        const toolName = content.name;
        const toolArgs = content.input as { [x: string]: unknown } | undefined;
  
        const result = await this.mcp.callTool({
          name: toolName,
          arguments: toolArgs,
        });
        toolResults.push(result);
        finalText.push(
          `[调用工具 ${toolName}，参数 ${JSON.stringify(toolArgs)}]`
        );
  
        messages.push({
          role: "user",
          content: typeof result.content === 'string' ? result.content : JSON.stringify(result.content),
        });
  
        const response = await this.anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages,
        });
  
        finalText.push(
          response.content[0].type === "text" ? response.content[0].text : ""
        );
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
      console.log("\nMCP 客户端已启动！");
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
      console.log("使用方法: node index.ts <path_to_server_script>");
      return;
    }
    const mcpClient = new MCPClient();
    try {
      await mcpClient.connectToServer(process.argv[2]);
      await mcpClient.chatLoop();
    } finally {
      await mcpClient.cleanup();
      process.exit(0);
    }
  }
  
  main();
