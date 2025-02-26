import express from "express";
import { playerRouter } from "./router/player";
import { teamRouter } from "./router/team";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { authRouter } from "./router/auth";
import { AuthService } from "./service/auth";
import { PlayerService } from "./service/player";
import { TeamService } from "./service/team";

export const app = express();

app.use(express.json());

dotenv.config({ path: './src/.env' });

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

const authService = new AuthService();
const playerService = new PlayerService();
const teamService = new TeamService(authService, playerService);
app.use("/player", playerRouter(playerService));
app.use("/team", teamRouter(teamService));
app.use("/user", authRouter(authService));