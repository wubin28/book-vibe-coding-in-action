// src/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import { injectable, inject, Container } from "inversify";
import "reflect-metadata";

dotenv.config();

// 定义接口类型
export interface IOpenAIClient {
  chat: {
    completions: {
      create: (params: any) => Promise<any>;
    };
  };
}

// 定义依赖注入的标识符
export const TYPES = {
  OpenAIClient: Symbol.for("OpenAIClient"),
};

// 创建真实的OpenAI客户端的工厂
export function createOpenAIClient(): IOpenAIClient {
  return new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
}

// 服务类
@injectable()
export class ApiService {
  private openai: IOpenAIClient;

  constructor(@inject(TYPES.OpenAIClient) openai: IOpenAIClient) {
    this.openai = openai;
  }

  async optimizeTemplate(template: string, res: Response): Promise<void> {
    try {
      console.log("Calling DeepSeek API with streaming...");
      const stream = await this.openai.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: template,
          },
        ],
        stream: true,
      });

      // Initialize full content for logging
      let fullContent = "";

      // Process the stream
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          console.log("Streaming chunk:", content);

          // Send the chunk to the client
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      console.log("Completed streaming. Full response:", fullContent);

      // End the stream
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error in optimize:", error);
      
      // Check if error is related to API key
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('authentication')) {
        // Send specific error for API key issues
        res.write(
          `data: ${JSON.stringify({ 
            error: ".env文件中的DEEPSEEK_API_KEY无效", 
            useTemplate: true,
            details: errorMessage 
          })}\n\n`
        );
      } else {
        // Send general error
        res.write(
          `data: ${JSON.stringify({ 
            error: "Failed to optimize prompt", 
            details: errorMessage 
          })}\n\n`
        );
      }
      res.end();
    }
  }
}

// 设置依赖注入容器
export function setupContainer(): Container {
  const container = new Container();
  // 修复 toFactory 的用法
  container.bind<IOpenAIClient>(TYPES.OpenAIClient).toDynamicValue(() => {
    return createOpenAIClient();
  });
  container.bind<ApiService>(ApiService).toSelf();
  return container;
}

// 创建Express应用
export function createApp(container: Container) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  
  const apiService = container.get<ApiService>(ApiService);

  app.post("/api/optimize", async (req: Request, res: Response) => {
    try {
      const { template } = req.body;
      console.log("Received template:", template);

      // Set headers for SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      await apiService.optimizeTemplate(template, res);
    } catch (error) {
      console.error("Error in /api/optimize route handler:", error);
      res.write(
        `data: ${JSON.stringify({ error: "Failed to process request", details: error instanceof Error ? error.message : String(error) })}\n\n`,
      );
      res.end();
    }
  });

  return app;
}

// 仅在直接运行时启动服务器
const isMainModule = typeof require !== 'undefined' && require.main === module;
if (isMainModule) {
  const port = process.env.PORT || 3000;
  const container = setupContainer();
  const app = createApp(container);
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export const config = {
  type: "module",
};