import express from "express";
import { playerRouter } from "./router/player";
import { teamRouter } from "./router/team";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

export const app = express();

app.use(express.json());

dotenv.config();
if (!process.env.SESSION_SECRET) {
    console.log("Could not find SESSION_SECRET in .env file");
    process.exit();
}
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use(cors({
    origin: true,
    credentials: true
}));

app.use("/player", playerRouter);
app.use("/team", teamRouter);
