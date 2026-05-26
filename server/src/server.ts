import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { connectRedis } from "./config/redis";
import { initSocket } from "./socket/index";
import { startAssignmentWorker } from "./workers/assignment.worker";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await connectRedis();

  const httpServer = http.createServer(app);
  initSocket(httpServer);
  startAssignmentWorker();

  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
