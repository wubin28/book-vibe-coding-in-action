# 如何运行第5章代码

在电脑上打开终端，进入本书配套代码所在目录`book-vibe-coding-in-action`，然后运行以下命令。

## 运行Next.js前后端一体化应用

```shell
# 进入第5章代码所在目录
cd ch05-bolt-trae/next-js-app

# 检查node.js版本，确保是18.x、20.x或22.x这些LTS版本
# 若尚未安装node.js版本管理工具nvm，请参考https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/进行安装
nvm current

# （可选）如果node.js版本不是LTS版本，建议安装node.js 22.x LTS版本
nvm install 22 && nvm use 22

# 安装依赖
npm install

# 运行后端
npm run dev

按住Cmd键（macOS）或Ctrl键（Windows11/Ubuntu），点击运行前端应用的终端中出现的链接http://localhost:3000，即可打开Promptyoo-1 Web应用。

在Promptyoo-1 Web应用中，点击“Optimize Prompt”按钮后，可以切换到运行后端代码的终端，观察后端代码的日志输出。
