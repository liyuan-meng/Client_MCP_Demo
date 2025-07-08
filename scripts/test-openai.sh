#!/bin/bash

echo "正在测试 MCP 客户端 OpenAI 版本..."
echo ""

# 检查是否设置了 API 密钥
# if [ -z "$OPENAI_API_KEY" ]; then
#     echo "错误: 未设置 OPENAI_API_KEY 环境变量"
#     echo "请在 .env 文件中设置："
#     echo "OPENAI_API_KEY=your_openai_api_key_here"
#     echo ""
#     echo "或者直接设置环境变量："
#     echo "export OPENAI_API_KEY=your_openai_api_key_here"
#     exit 1
# fi

# 检查是否已编译
if [ ! -f "dist/clients/openai.js" ]; then
    echo "正在编译 TypeScript 文件..."
    npm run build
fi

# 运行 OpenAI 版本
echo "启动 OpenAI 版本客户端..."
echo "您可以尝试以下查询："
echo "- 纽约州有什么天气警报吗？"
echo "- 加州最近有暴雨警告吗？"
echo "- 纬度 40.7128，经度 -74.0060 的天气预报"
echo "- quit (退出)"
echo ""

node dist/clients/openai.js /Users/liyuanmeng/Workspace/Github/Wether_MCP/build/index.js