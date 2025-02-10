import express from "express";
import { playerRouter } from "./router/player";
import cors from "cors";

export const app = express();
app.use(cors());
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
});
app.use(express.json());
app.use(playerRouter);
