import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

app.post("/api/optimize", async (req: Request, res: Response) => {
  try {
    const { template } = req.body;
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
    console.error("Error in /api/optimize:", error);
    res.write(
      `data: ${JSON.stringify({ error: "Failed to optimize prompt", details: error instanceof Error ? error.message : String(error) })}\n\n`,
    );
    res.end();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export const config = {
  type: "module",
};
