#file:rule-architecture.md 是本项目的架构描述。作为 Node.js 专家，请参考该架构描述中的后端技术栈在 2025 年的最佳实践，在 backend 目录下创建一个 Node.js 后端应用。该后端需要支持 frontend 目录下的 React 前端应用 #codebase 调用，并通过后端向 DeepSeek 官方 API 发送请求。调用 DeepSeek API 的 Node.js 示例代码见后文。

同时，请修改前端代码实现以下功能：当用户点击"Optimize Prompt"按钮时，前端将 App.tsx 文件中 template 变量的内容通过 Node.js 后端发送给 DeepSeek。发送前，需清空 UI 右侧最下方"Optimized Prompt"下的所有内容。收到 DeepSeek 回复后，将回复内容显示在"Optimized Prompt"下方。

如果 DeepSeek 长时间未响应，则在"Optimized Prompt"下方显示"DeepSeek 没有响应"。

请将 DeepSeek API key（值为 sk-bxxx）保存在 backend/.env 文件中。以下是调用 DeepSeek API 的 Node.js 示例代码：
```jsx
// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";

const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: '<DeepSeek API Key>'
});

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "deepseek-chat",
  });

  console.log(completion.choices[0].message.content);
}

main();
```
