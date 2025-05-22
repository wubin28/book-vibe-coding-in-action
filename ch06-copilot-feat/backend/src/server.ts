import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

// Load environment variables
const envResult = dotenv.config();
if (envResult.error) {
  console.error("Error loading .env file:", envResult.error);
  console.error("Please create a .env file in the backend directory with the required environment variables.");
  console.error("You can use the following template:");
  console.error("\nPORT=3000");
  console.error("DEEPSEEK_API_KEY=your_api_key_here\n");
  process.exit(1);
}

// Validate required environment variables
if (!process.env.DEEPSEEK_API_KEY) {
  console.error("\nError: DEEPSEEK_API_KEY environment variable is not set");
  console.error("Please set it in your .env file:");
  console.error("DEEPSEEK_API_KEY=your_api_key_here\n");
  process.exit(1);
}

if (process.env.DEEPSEEK_API_KEY === "your_api_key_here") {
  console.error("\nError: Please replace the default DEEPSEEK_API_KEY value with your actual API key");
  console.error("Update your .env file with your actual DeepSeek API key\n");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let openai: OpenAI;
try {
  openai = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: process.env.DEEPSEEK_API_KEY,
  });
} catch (error) {
  console.error("Failed to initialize OpenAI client:", error);
  process.exit(1);
}

app.post("/api/optimize", async (req: Request, res: Response) => {
  try {
    const { template } = req.body;
    if (!template) {
      throw new Error("Template is required");
    }
    
    console.log("Received template:", template);

    // Set headers for SSE
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    console.log("Calling DeepSeek API with streaming...");
    const stream = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "user",
          content: template,
        },
      ],
      stream: true,
    }).catch(error => {
      console.error("DeepSeek API error:", error);
      throw new Error(error instanceof Error ? error.message : "Failed to connect to DeepSeek API");
    });

    // Initialize full content for logging
    let fullContent = "";

    try {
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
    } catch (streamError) {
      console.error("Stream processing error:", streamError);
      throw new Error("Failed to process the response stream");
    }
  } catch (error) {
    console.error("Error in /api/optimize:", error);
    // Ensure the error response is properly formatted for SSE
    const errorMessage = error instanceof Error ? error.message : String(error);
    res.write(`data: ${JSON.stringify({ error: "Failed to optimize prompt", details: errorMessage })}\n\n`);
    res.end();
  }
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Handle process termination
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, just log the error
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export const config = {
  type: "module",
};
