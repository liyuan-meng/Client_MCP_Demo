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
echo "- 你好"
echo "- 帮我加两个数字"
echo "- 现在几点了"
echo "- 生成一个随机数"
echo "- quit (退出)"
echo ""

# 使用本地的天气服务器进行测试（/Users/liyuanmeng/Workspace/Github/Wether_MCP/build/index.js）
node dist/clients/mock.js /Users/liyuanmeng/Workspace/Github/Wether_MCP/build/index.js