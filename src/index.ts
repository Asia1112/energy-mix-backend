import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import energyRoutes from "./routes/energy.routes";

dotenv.config();

const app = express();
const corsOriginConfig = process.env.CORS_ORIGIN || "*";
const corsOrigins = corsOriginConfig
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (
        corsOrigins.includes("*") ||
        !origin ||
        corsOrigins.includes(origin)
      ) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS."));
    }
  })
);
app.use(express.json());

app.use("/api", energyRoutes);

app.get("/", (req, res) => {
  res.send("Energy Mix API is running.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
