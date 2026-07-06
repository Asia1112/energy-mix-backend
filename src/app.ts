import express from "express";
import cors from "cors";
import energyRoutes from "./routes/energy.routes";

export function createApp() {
  const app = express();
  const corsOriginConfig = process.env.CORS_ORIGIN || "*";
  const corsOrigins = corsOriginConfig
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const corsOrigin = corsOrigins.includes("*") ? "*" : corsOrigins;

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/api", energyRoutes);

  app.get("/", (req, res) => {
    res.send("Energy Mix API is running.");
  });

  return app;
}
