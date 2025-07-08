import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createInterface } from "readline/promises";
import { MCPClientBase, MCPTool, MCPClientConfig } from "../types/index.js";
import { getScriptCommand, generateMockArgs, createRandomResponse, formatErrorMessage } from "../utils/index.js";

// 模拟 AI 响应
class MockAI {
  async generateResponse(query: string, tools: MCPTool[]): Promise<string> {
    const randomResponse = createRandomResponse(query);
    
    // 如果有工具可用，模拟工具调用
    if (tools.length > 0) {
      const randomTool = tools[Math.floor(Math.random() * tools.length)];
      return `${randomResponse}\n\n[模拟调用工具 ${randomTool.name}]\n这是一个模拟的工具调用结果。在实际环境中，这里会显示真实的工具执行结果。`;
    }
    
    return randomResponse;
  }
}

class MCPClientMock extends MCPClientBase {
  private mockAI: MockAI;

  constructor() {
    super({ name: "mcp-client-cli-mock", version: "1.0.0" });
    this.mockAI = new MockAI();
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
    // 智能解析用户查询，选择合适的工具
    const toolCall = this.parseUserQuery(query);
    
    if (toolCall) {
      try {
        console.log(`\n🔧 调用工具: ${toolCall.toolName}`);
        console.log(`📥 参数: ${JSON.stringify(toolCall.arguments, null, 2)}`);
        
        const result = await this.mcp.callTool({
          name: toolCall.toolName,
          arguments: toolCall.arguments,
        });
        
        return `\n✅ 工具调用成功！\n📤 结果: ${JSON.stringify(result.content, null, 2)}`;
      } catch (e) {
        return `\n❌ 工具调用失败: ${formatErrorMessage(e)}`;
      }
    } else {
      // 如果无法解析为工具调用，返回模拟响应
      const response = await this.mockAI.generateResponse(query, this.tools);
      return `\n💭 模拟响应: ${response}\n\n💡 提示: 尝试使用可用的工具命令，如:\n${this.tools.map(t => `   - ${t.name}`).join('\n')}`;
    }
  }

  private parseUserQuery(query: string): { toolName: string; arguments: any } | null {
    const lowerQuery = query.toLowerCase().trim();
    
    // 解析 get-alerts 命令
    if (lowerQuery.startsWith('get-alerts')) {
      const parts = query.split(' ');
      if (parts.length >= 2) {
        const state = parts[1].toUpperCase();
        return {
          toolName: 'get-alerts',
          arguments: { state: state }
        };
      }
    }
    
    // 解析 get-forecast 命令
    if (lowerQuery.startsWith('get-forecast')) {
      const parts = query.split(' ');
      if (parts.length >= 3) {
        const latitude = parseFloat(parts[1]);
        const longitude = parseFloat(parts[2]);
        if (!isNaN(latitude) && !isNaN(longitude)) {
          return {
            toolName: 'get-forecast',
            arguments: { latitude, longitude }
          };
        }
      }
    }
    
    // 检查是否包含工具名称
    for (const tool of this.tools) {
      if (lowerQuery.includes(tool.name.toLowerCase())) {
        return {
          toolName: tool.name,
          arguments: this.generateSmartArgs(tool, query)
        };
      }
    }
    
    return null;
  }

  private generateSmartArgs(tool: any, query: string): any {
    const args: any = {};
    
    // 根据工具类型生成智能参数
    if (tool.name === 'get-alerts' && tool.inputSchema?.properties?.state) {
      // 尝试从查询中提取州代码
      const stateMatch = query.match(/\b([A-Z]{2})\b/);
      args.state = stateMatch ? stateMatch[1] : 'CA';
    } else if (tool.name === 'get-forecast' && tool.inputSchema?.properties) {
      // 为天气预报生成示例坐标
      if (tool.inputSchema.properties.latitude) {
        args.latitude = 40.7128; // 纽约的纬度
      }
      if (tool.inputSchema.properties.longitude) {
        args.longitude = -74.0060; // 纽约的经度
      }
    } else {
      // 使用原来的随机生成方法
      return generateMockArgs(tool.inputSchema);
    }
    
    return args;
  }

  private generateMockArgs(schema: any): any {
    return generateMockArgs(schema);
  }

  async chatLoop() {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  
    try {
      console.log("\n🤖 MCP 客户端已启动！(模拟模式)");
      console.log("📝 这是一个测试版本，不需要真实的 API 密钥。");
      console.log("\n🛠️ 可用工具:");
      this.tools.forEach(tool => {
        console.log(`   📋 ${tool.name}: ${tool.description}`);
      });
      
      console.log("\n💡 使用示例:");
      console.log("   📊 天气警报: get-alerts NY");
      console.log("   🌤️  天气预报: get-forecast 40.7128 -74.0060");
      console.log("   ❌ 退出程序: quit");
      console.log("\n" + "=".repeat(50));
  
      while (true) {
        const message = await rl.question("\n🔍 查询: ");
        if (message.toLowerCase().trim() === "quit" || message.toLowerCase().trim() === "exit") {
          console.log("\n👋 再见！");
          break;
        }
        
        if (message.trim() === "") {
          console.log("❓ 请输入一个查询或命令");
          continue;
        }
        
        const response = await this.processQuery(message);
        console.log(response);
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
      console.log("使用方法: node index-mock.js <path_to_server_script>");
      console.log("这是一个模拟版本，用于测试 MCP 客户端功能。");
      return;
    }
    const mcpClient = new MCPClientMock();
    try {
      await mcpClient.connectToServer(process.argv[2]);
      await mcpClient.chatLoop();
    } finally {
      await mcpClient.cleanup();
      process.exit(0);
    }
  }
  
  main(); 