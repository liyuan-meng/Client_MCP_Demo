import { MCPTool } from "../types/index.js";

/**
 * 检查是否为 JavaScript 文件
 */
export function isJavaScriptFile(path: string): boolean {
  return path.endsWith(".js");
}

/**
 * 检查是否为 Python 文件
 */
export function isPythonFile(path: string): boolean {
  return path.endsWith(".py");
}

/**
 * 获取适当的命令来运行脚本
 */
export function getScriptCommand(scriptPath: string): string {
  if (isPythonFile(scriptPath)) {
    return process.platform === "win32" ? "python" : "python3";
  } else if (isJavaScriptFile(scriptPath)) {
    return process.execPath;
  } else {
    throw new Error("服务器脚本必须是 .js 或 .py 文件");
  }
}

/**
 * 格式化工具列表为可读的字符串
 */
export function formatToolsList(tools: MCPTool[]): string {
  return tools.map(tool => `- ${tool.name}: ${tool.description}`).join("\n");
}

/**
 * 验证 API 密钥是否存在
 */
export function validateApiKey(apiKey: string | undefined, provider: string): string {
  if (!apiKey) {
    throw new Error(`${provider}_API_KEY 未设置`);
  }
  return apiKey;
}

/**
 * 生成模拟参数
 */
export function generateMockArgs(schema: any): any {
  const mockArgs: any = {};
  
  if (schema && schema.properties) {
    for (const [key, value] of Object.entries(schema.properties as any)) {
      const valueSchema = value as any;
      if (valueSchema.type === "string") {
        mockArgs[key] = "测试值";
      } else if (valueSchema.type === "number") {
        mockArgs[key] = 42;
      } else if (valueSchema.type === "boolean") {
        mockArgs[key] = true;
      } else if (valueSchema.type === "array") {
        mockArgs[key] = [];
      } else if (valueSchema.type === "object") {
        mockArgs[key] = {};
      }
    }
  }
  
  return mockArgs;
}

/**
 * 创建随机响应
 */
export function createRandomResponse(query: string): string {
  const responses = [
    `我收到了您的查询："${query}"。这是一个模拟响应。`,
    `基于您的问题："${query}"，我建议您查看相关文档。`,
    `关于 "${query}"，我需要更多信息来提供准确的答案。`,
    `您的查询 "${query}" 很有趣。让我为您提供一些建议。`,
    `针对 "${query}"，我可以为您提供以下信息。`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * 安全地解析 JSON
 */
export function safeJsonParse(jsonString: string): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("JSON 解析错误:", error);
    return {};
  }
}

/**
 * 格式化错误消息
 */
export function formatErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
} 