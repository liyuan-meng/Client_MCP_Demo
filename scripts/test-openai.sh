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
echo "- 你好，请介绍一下自己"
echo "- 帮我计算 25 + 17"
echo "- 现在几点了"
echo "- 生成一个随机数"
echo "- quit (退出)"
echo ""

node dist/clients/openai.js /Users/liyuanmeng/Workspace/Github/Wether_MCP/build/index.js