import path from "path";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL,
  })
);
  
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/pdfs", express.static(path.join(process.cwd(), "pdfs")));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
