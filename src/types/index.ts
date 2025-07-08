// 通用类型定义
export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export interface MCPToolResult {
  content: string | any;
  isError?: boolean;
}

export interface MCPClientConfig {
  name: string;
  version: string;
  [key: string]: unknown;
}

export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  toolCalls?: ToolCall[];
}

export interface ToolCall {
  name: string;
  arguments: any;
  id?: string;
}

export interface ClientOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
}

// 抽象客户端接口
export abstract class MCPClientBase {
  protected mcp: any;
  protected transport: any;
  protected tools: MCPTool[] = [];

  constructor(protected config: MCPClientConfig) {}

  abstract connectToServer(serverScriptPath: string): Promise<void>;
  abstract processQuery(query: string): Promise<string>;
  abstract chatLoop(): Promise<void>;
  abstract cleanup(): Promise<void>;
} 