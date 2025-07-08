#!/bin/bash

echo "正在测试 MCP 客户端模拟版本..."
echo ""

# 检查是否已编译
if [ ! -f "dist/clients/mock.js" ]; then
    echo "正在编译 TypeScript 文件..."
    npm run build
fi

# 运行模拟版本
echo "启动模拟版本客户端..."
echo "您可以尝试以下查询："
echo "- get-alerts NY"
echo "- get-alerts CA"
echo "- get-forecast 40.7128 -74.0060"
echo "- get-forecast 34.0522 -118.2437"
echo "- quit (退出)"
echo ""

# 使用本地的天气服务器进行测试（/Users/liyuanmeng/Workspace/Github/Wether_MCP/build/index.js）
node dist/clients/mock.js /Users/liyuanmeng/Workspace/Github/Wether_MCP/build/index.js