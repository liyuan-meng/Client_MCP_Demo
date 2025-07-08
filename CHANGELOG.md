# 变更日志

所有重要的项目变更都会记录在此文件中。

## [1.1.0] - 2024-12-XX

### 🏗️ 重大重构

#### 新增
- 📁 **重新组织目录结构**
  - `src/` - 源代码目录
  - `src/clients/` - 客户端实现
  - `src/types/` - 类型定义
  - `src/utils/` - 工具函数
  - `examples/` - 示例文件
  - `scripts/` - 脚本目录
  - `docs/` - 文档目录

- 🧰 **新增工具函数模块**
  - `getScriptCommand()` - 脚本命令获取
  - `validateApiKey()` - API 密钥验证
  - `generateMockArgs()` - 模拟参数生成
  - `createRandomResponse()` - 随机响应创建
  - `formatErrorMessage()` - 错误消息格式化

- 🏷️ **新增类型定义模块**
  - `MCPClientBase` - 抽象客户端基类
  - `MCPTool` - MCP 工具接口
  - `MCPClientConfig` - 客户端配置接口
  - 其他通用类型定义

#### 变更
- 📦 **文件重命名和移动**
  - `index.ts` → `src/clients/anthropic.ts`
  - `index-openai.ts` → `src/clients/openai.ts`
  - `index-mock.ts` → `src/clients/mock.ts`
  - `simple-mcp-server.js` → `examples/simple-mcp-server.js`
  - `test-*.sh` → `scripts/test-*.sh`
  - `测试说明.md` → `docs/测试说明.md`

- 🔧 **配置文件更新**
  - `tsconfig.json` - 更新编译路径和包含/排除规则
  - `package.json` - 更新脚本路径和新增 clean 脚本
  - `.gitignore` - 移除 build/ 目录，保留 dist/

- 🏗️ **代码架构改进**
  - 所有客户端继承自 `MCPClientBase` 抽象类
  - 使用统一的工具函数处理通用逻辑
  - 统一的类型定义确保类型安全

#### 修复
- 🐛 修复类型错误
- 🔧 改进错误处理
- 📝 更新所有文档以反映新结构

#### 文档
- 📚 **新增文档**
  - `docs/目录结构说明.md` - 详细的目录结构说明
  - `CHANGELOG.md` - 本变更日志文件

- 📝 **更新文档**
  - `README.md` - 更新项目结构和使用说明
  - `docs/测试说明.md` - 更新路径引用

## [1.0.0] - 2024-12-XX

### 初始版本

#### 功能特性
- 🤖 **多 AI 服务支持**
  - Anthropic Claude 客户端
  - OpenAI GPT 客户端
  - 模拟客户端（无需 API 密钥）

- 🛠️ **MCP 功能**
  - MCP 服务器连接
  - 工具调用支持
  - 交互式聊天界面

- 📦 **示例和工具**
  - 示例 MCP 服务器
  - 测试脚本
  - 完整的文档

#### 技术栈
- TypeScript
- Node.js
- Anthropic SDK
- OpenAI SDK
- MCP SDK

---

## 版本格式说明

本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

版本格式：`主版本号.次版本号.修订号`

- **主版本号**：不兼容的 API 修改
- **次版本号**：向下兼容的功能性新增
- **修订号**：向下兼容的问题修正

## 图标说明

- 🎉 新功能
- 🏗️ 重构
- 🐛 Bug 修复
- 🔧 配置变更
- 📝 文档更新
- 📦 依赖更新
- 🚀 性能改进
- 🔒 安全性改进 