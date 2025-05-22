# 如何运行第7章代码

在电脑上打开终端，进入本书配套代码所在目录`book-vibe-coding-in-action`，然后运行以下命令。

## 运行后端代码

```shell
# 进入第7章代码所在目录的后端
cd ch07-copilot-ut/backend

# 检查node.js版本，确保是18.x、20.x或22.x这些LTS版本
# 若尚未安装node.js版本管理工具nvm，请参考https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/进行安装
nvm current

# （可选）如果node.js版本不是LTS版本，建议安装node.js 22.x LTS版本
nvm install 22 && nvm use 22

# 安装依赖
npm install

# 运行后端
npm run dev
```

此时会看到终端出现错误信息`Error loading .env file`，这很正常。这是因为后端代码需要使用.env文件中的环境变量，其中包含访问DeepSeek API的API密钥，我不便上传到代码库。请运行下述命令创建.env文件进行修复。

```shell
# 对于mac/ubuntu用户（如果你有DeepSeek API密钥，请将下面一行中的xxx替换为你的API密钥；如果没有，保持xxx不变程序也能处理）
echo -e "PORT=3000\nDEEPSEEK_API_KEY=xxx" > .env

# 对于Windows 11的PowerShell用户（如果你有DeepSeek API密钥，请将下面一行中的xxx替换为你的API密钥；如果没有，保持xxx不变程序也能处理）
"PORT=3000`nDEEPSEEK_API_KEY=xxx" > .env
```

## 运行前端代码

保持后端代码运行，然后打开另一个终端，进入第6章代码所在目录的前端，运行以下命令。

```shell
# 进入第6章代码所在目录的前端
cd ch06-copilot-feat/frontend

# 安装依赖
npm install

# 运行前端
npm run dev
```

## 运行Promptyoo-0 Web应用

按住Cmd键（macOS）或Ctrl键（Windows11/Ubuntu），点击运行前端应用的终端中出现的链接http://localhost:5173，即可打开Promptyoo-0 Web应用。

在Promptyoo-0 Web应用中，点击“Optimize Prompt”按钮后，可以切换到运行后端代码的终端，观察后端代码的日志输出。

## 运行前端单元测试

```shell
# 切换到运行前端代码的终端，按Ctrl+C停止前端代码运行

# 运行前端单元测试
npm test
```

## 运行后端单元测试

```shell
# 切换到运行后端代码的终端，按Ctrl+C停止后端代码运行

# 运行后端单元测试
npm test
```
