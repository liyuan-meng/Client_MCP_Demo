# MCP 客户端演示项目

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.1.0-brightgreen.svg)](package.json)

一个功能完整的 Model Context Protocol (MCP) 客户端实现，支持多种 AI 服务提供商和智能模拟模式。可以连接到任何 MCP 服务器，包括天气服务、文件操作、数据库查询等。

## 🎬 一、演示效果

### 🎭 智能模拟模式（连接天气 MCP 服务器）

```bash
$ ./scripts/test-mock.sh

🤖 MCP 客户端已启动！(模拟模式)
📝 这是一个测试版本，不需要真实的 API 密钥。

🛠️ 可用工具:
   📋 get-alerts: 获取某个州的天气警报
   📋 get-forecast: 获取某个位置的天气预报

💡 使用示例:
   📊 天气警报: get-alerts NY
   🌤️  天气预报: get-forecast 40.7128 -74.0060
   ❌ 退出程序: quit

==================================================

🔍 查询: get-alerts NY

🔧 调用工具: get-alerts
📥 参数: {"state": "NY"}
✅ 工具调用成功！
📤 结果: [
  {
    "type": "text", 
    "text": "当前纽约州没有活跃的天气警报。"
  }
]

🔍 查询: get-forecast 40.7128 -74.0060

🔧 调用工具: get-forecast
📥 参数: {"latitude": 40.7128, "longitude": -74.0060}
✅ 工具调用成功！
📤 结果: [详细的天气预报数据]

🔍 查询: quit
👋 再见！
```

### 🤖 OpenAI 智能模式（自然语言交互）

```bash
$ ./scripts/test-openai.sh

🔍 查询: 纽约州有什么天气警报吗？
[AI 理解] → 调用 get-alerts 工具 → 参数: {"state": "NY"}
[返回天气警报信息]

🔍 查询: 我想知道纽约市的天气预报
[AI 理解] → 调用 get-forecast 工具 → 自动识别纽约市坐标
[返回详细天气预报]
```

## 📦 二、安装

### 前置要求

- Node.js 18.x 或更高版本
- npm 或 yarn


### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

## 🚀 三、快速开始

### 1. 模拟模式（推荐新手）

无需任何 API 密钥，立即开始测试，连接到本地天气 MCP 服务器：

```bash
# 如果脚本没有执行权限，先添加权限
chmod +x scripts/test-mock.sh

# 运行模拟版本（连接到本地天气服务 MCP）
./scripts/test-mock.sh
```

**支持的命令格式:**
- `get-alerts NY` - 获取纽约州天气警报
- `get-forecast 40.7128 -74.0060` - 获取纽约市天气预报
- `quit` - 退出程序

### 2. OpenAI 模式

支持自然语言交互，AI 会智能理解您的意图并调用相应工具：

1. 获取 OpenAI API 密钥：
   - 访问 [OpenAI Platform](https://platform.openai.com/api-keys)
   - 创建新的 API 密钥

2. 配置环境变量：
   ```bash
   # 创建 .env 文件
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

3. 运行客户端：
   ```bash
   # 如果脚本没有执行权限，先添加权限
   chmod +x scripts/test-openai.sh
   
   # 运行 OpenAI 版本
   ./scripts/test-openai.sh
   ```

**自然语言示例:**
- "纽约州有什么天气警报吗？"
- "我想知道纽约市的天气预报"
- "加州有暴雨警告吗？"

### 3. Anthropic Claude 模式（无法申请密钥，暂未调试）

1. 获取 Anthropic API 密钥：
   - 访问 [Anthropic Console](https://console.anthropic.com/)
   - 创建新的 API 密钥

2. 配置环境变量：
   ```bash
   echo "ANTHROPIC_API_KEY=your_anthropic_api_key_here" > .env
   ```

3. 运行客户端：
   ```bash
   npm run start examples/simple-mcp-server.js
   ```

## 📋 四、版本对比

### 🎭 模拟版本 (`src/clients/mock.ts`)
- **工作原理**: 基于规则的智能解析，无需 AI 服务
- **优点**: 无需 API 密钥，立即可用，响应迅速
- **适用场景**: 学习 MCP 概念、测试工具调用、开发调试
- **支持命令**: 特定格式命令（如 `get-alerts NY`）
- **交互方式**: 命令行式，支持简单的自然语言理解

### 🤖 OpenAI 版本 (`src/clients/openai.ts`)
- **工作原理**: 使用 GPT-3.5-turbo 进行自然语言理解
- **优点**: 注册容易，有免费额度，支持完全自然语言交互
- **适用场景**: 真实的 AI 交互体验，复杂查询理解
- **支持命令**: 任何自然语言查询
- **交互方式**: 对话式，AI 智能理解用户意图

### 🧠 Anthropic 版本 (`src/clients/anthropic.ts`)
- **工作原理**: 使用 Claude-3.5-sonnet 进行自然语言理解
- **优点**: 优秀的推理能力，高质量响应
- **适用场景**: 复杂的任务处理，专业应用
- **支持命令**: 任何自然语言查询
- **交互方式**: 对话式，强大的逻辑推理能力

## 🛠️ 五、可用命令

| 命令 | 描述 |
|------|------|
| `npm run build` | 编译 TypeScript 文件 |
| `npm run start` | 运行 Anthropic 版本（连接简单示例服务器） |
| `npm run start:openai` | 运行 OpenAI 版本（连接天气服务器） |
| `npm run start:mock` | 运行模拟版本（连接天气服务器） |
| `npm run weather` | 运行天气服务器 |
| `npm run weather:fg` | 在前台运行天气服务器 |
| `./scripts/test-mock.sh` | 快速测试模拟版本 |
| `./scripts/test-openai.sh` | 快速测试 OpenAI 版本 |

## 📁 六、项目结构

```
Client_MCP_Demo/
├── src/                      # 源代码目录
│   ├── clients/             # 不同的客户端实现
│   │   ├── anthropic.ts     # Anthropic 版本客户端
│   │   ├── openai.ts        # OpenAI 版本客户端
│   │   └── mock.ts          # 模拟版本客户端
│   ├── types/               # 类型定义
│   │   └── index.ts         # 通用类型定义
│   └── utils/               # 工具函数
│       └── index.ts         # 工具函数实现
├── dist/                    # 编译输出目录
│   ├── clients/             # 编译后的客户端
│   ├── types/               # 编译后的类型定义
│   └── utils/               # 编译后的工具函数
├── examples/                # 示例文件
│   └── simple-mcp-server.js # 示例 MCP 服务器
├── scripts/                 # 脚本目录
│   ├── test-mock.sh         # 模拟版本测试脚本
│   └── test-openai.sh       # OpenAI 版本测试脚本
├── docs/                    # 文档目录
│   └── 测试说明.md         # 详细的测试说明
├── package.json             # 项目依赖配置
├── package-lock.json        # 依赖版本锁定
├── tsconfig.json            # TypeScript 配置
├── .gitignore               # Git 忽略文件
├── LICENSE                  # MIT 许可证
└── README.md                # 项目说明文档
```

## 🎯 七、MCP 服务器

### 🌤️ 天气服务器（主要用于演示）

位置：使用 [MCP Weather Server](https://github.com/liyuan-meng/Weather_MCP_Demo)

| 工具 | 描述 | 参数 | 示例 |
|------|------|------|------|
| `get-alerts` | 获取某个州的天气警报 | `state: string` | `get-alerts NY` |
| `get-forecast` | 获取某个位置的天气预报 | `latitude: number, longitude: number` | `get-forecast 40.7128 -74.0060` |


## 💬 八、使用示例

### 🎭 模拟版本查询示例

启动模拟客户端后，您可以尝试以下命令：

```
🔍 查询: get-alerts NY
🔍 查询: get-alerts CA 
🔍 查询: get-forecast 40.7128 -74.0060
🔍 查询: get-forecast 34.0522 -118.2437
🔍 查询: quit  # 退出程序
```

### 🤖 OpenAI/Anthropic 版本查询示例

启动 AI 客户端后，您可以尝试以下自然语言查询：

```
🔍 查询: 纽约州有什么天气警报吗？
🔍 查询: 我想知道纽约市的天气预报
🔍 查询: 加州最近有暴雨警告吗？
🔍 查询: 洛杉矶的天气怎么样？
🔍 查询: 查看德州的天气警报
🔍 查询: 纬度 40.7128，经度 -74.0060 的天气预报
🔍 查询: quit  # 退出程序
```

### 📍 常用城市坐标参考

| 城市 | 纬度 | 经度 |
|------|------|------|
| 纽约市 | 40.7128 | -74.0060 |
| 洛杉矶 | 34.0522 | -118.2437 |
| 芝加哥 | 41.8781 | -87.6298 |
| 休斯顿 | 29.7604 | -95.3698 |
| 迈阿密 | 25.7617 | -80.1918 |

## 🔧 九、配置

### 环境变量

在项目根目录创建 `.env` 文件：

```env
# Anthropic API 密钥（用于原始版本）
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# OpenAI API 密钥（用于 OpenAI 版本）
OPENAI_API_KEY=your_openai_api_key_here
```

### 自定义 MCP 服务器

您可以连接到任何自定义的 MCP 服务器：

```bash
# 使用模拟版本连接到自定义服务器
npm run start:mock -- your-mcp-server.js

# 使用 OpenAI 版本连接到自定义服务器  
npm run start:openai -- your-mcp-server.js

# 使用 Anthropic 版本连接到自定义服务器
npm run start -- your-mcp-server.js
```

**注意**: 模拟版本仅支持预定义的命令格式，如果要支持自定义工具，需要修改 `src/clients/mock.ts` 中的解析逻辑。

### 🧠 模拟版本智能解析说明

模拟版本在 v1.1.0 中增加了智能解析功能，能够理解以下格式：

```typescript
// 支持的命令模式
const patterns = [
  /^get-alerts?\s+([A-Z]{2})$/i,              // get-alerts NY
  /^get-forecast\s+(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/i, // get-forecast 40.7128 -74.0060
  /^quit|exit$/i                               // quit 或 exit
];

// 智能提取参数
- "get-alerts NY" → { tool: "get-alerts", state: "NY" }
- "get-forecast 40.7128 -74.0060" → { tool: "get-forecast", latitude: 40.7128, longitude: -74.0060 }
```

这使得模拟版本在无需 API 密钥的情况下，也能提供接近真实的交互体验。

## 🚨 十、故障排除

### 常见问题

#### 1. 网络超时错误
```bash
# 使用国内 npm 镜像
npm config set registry https://registry.npmmirror.com
npm install
```

#### 2. API 密钥错误
- 确保 `.env` 文件在项目根目录
- 检查 API 密钥是否正确设置
- 确认 API 密钥有效且有足够额度

#### 3. 模块找不到错误
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. 权限错误
```bash
# 给脚本添加执行权限
chmod +x scripts/test-mock.sh
chmod +x scripts/test-openai.sh
```

#### 5. 天气 API 限制
- 天气服务器使用美国国家气象局 API，免费且无需密钥
- 仅支持美国的州代码（如 NY、CA、TX）
- 坐标应在美国境内，海外坐标可能返回错误

## 📚 十一、学习资源

### 官方文档
- [Model Context Protocol 官方文档](https://modelcontextprotocol.io/)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [OpenAI API 文档](https://platform.openai.com/docs/)

### 项目文档
- [目录结构说明](docs/目录结构说明.md) - 详细的项目结构说明
- [变更日志](CHANGELOG.md) - 项目版本变更记录


## 📞 十二、支持

如果您遇到任何问题或需要帮助，请：

1. 查看 [故障排除](#-故障排除) 部分
2. 尝试不同的客户端版本（模拟版本 → OpenAI 版本 → Anthropic 版本）
3. 检查控制台错误信息，确认网络连接和 API 密钥配置
4. 创建 GitHub Issue 并提供详细的错误信息

---

⭐ 如果这个项目对您有帮助，请给它一个星星！ 