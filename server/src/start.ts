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
import { UserDBService } from "./service/userDB";
import { TeamDBService } from "./service/teamDB";
import { PlayerModel } from "./db/player.db";
import sequelize from "sequelize/types/sequelize";
import { conn } from "./db/conn";
import { PlayerDBService } from "./service/playerDB";
import { ClubModel } from "./db/club.db";
import { GameSessionService } from "./service/game_session";
import { PointSystemService } from "./service/pointsystem";
import { gamesessionRouter } from "./router/game_session";

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

const gamesessionService = new GameSessionService();
const userService = new UserDBService();
const pointSystemService = new PointSystemService();
const playerService = new PlayerDBService();
const teamService = new TeamDBService(userService, playerService, pointSystemService, gamesessionService);

userService.setTeamService(teamService);
userService.setPlayerService(playerService);
gamesessionService.setTeamService(teamService);
gamesessionService.setUserService(userService);

app.use("/player", playerRouter(playerService));
app.use("/team", teamRouter(teamService));
app.use("/user", authRouter(userService));
app.use("/gamesession", gamesessionRouter(gamesessionService));


