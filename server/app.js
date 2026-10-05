import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { createPeopleRouter } from "./routes/people.js";
import { createVisitsRouter } from "./routes/visits.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.disable("x-powered-by");

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    })
  );

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || true,
      credentials: true,
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 200,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Too many requests. Please try again later." },
    })
  );

  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use(createPeopleRouter());
  app.use(createVisitsRouter());

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.originalUrl}` });
  });

  app.use((error, _req, res, _next) => {
    console.error("Unhandled API error:", error);

    const statusCode = error.statusCode || 500;
    const message =
      statusCode === 500
        ? "Internal server error."
        : error.message || "Something went wrong.";

    res.status(statusCode).json({ error: message });
  });

  return app;
}
