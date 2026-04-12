import cors from "cors";
import express from "express";
import { connectMongoose } from "./src/db/mongoClient.js";
import apiRouter from "./src/routes/index.js";
import {seedAdmin} from "./src/modules/auth/authAndUserRepository.js"
import 'dotenv/config'; 


const app = express();
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:4000";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use("/api", apiRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

await connectMongoose();
seedAdmin();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
