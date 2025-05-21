// src/index.ts
import { setupContainer, createApp } from "./server.js";

const port = process.env.PORT || 3000;
const container = setupContainer();
const app = createApp(container);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});