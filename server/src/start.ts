import express from "express";
import { playerRouter } from "./router/player";
import { teamRouter } from "./router/team";
import cors from "cors";

export const app = express(); 

app.use(express.json());
app.use(cors());
app.use("/player", playerRouter);
app.use("/team", teamRouter);
