import { pathToFileURL } from "node:url";
import { createApp } from "./app.js";

const app = createApp();
const port = Number(process.env.PORT || 3001);

const isDirectExecution =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export default app;
