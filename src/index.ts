import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import energyRoutes from "./routes/energy.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", energyRoutes);

app.get("/", (req, res) => {
  res.send("Energy Mix API is running.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});