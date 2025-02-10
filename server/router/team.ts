import express, { Request, Response } from "express";
import { TeamService } from '../service/team';
import { Team } from '../model/team.interface';
import { PlayerService } from '../service/player';
import { Player } from '../model/player.interface';

const playerService = new PlayerService(); 
const teamService = new TeamService(playerService);

export const teamRouter = express.Router();


teamRouter.get("/players", async (
    req: Request,
    res: Response<Array<Player> | String>
) => {
    try {
        const players = await teamService.getPlayers();
        res.status(200).send(players);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}); 

teamRouter.get("/balance", async (
    req: Request,
    res: Response<number | String>
) => {
    try {
        const number = await teamService.getBalance();
        res.status(200).send(number);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}); 

teamRouter.post("/buy", async (
    req: Request<{}, {}, { id: number }>,
    res: Response<Player | string>
) => {
    try {
        const id = req.body.id;
        if (typeof(id) != "number"  || id < 0 || !Number.isInteger(id)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id has type ${typeof(id)} and value ${id}`);
            return;
        }

        const player = await teamService.buyPlayer(id);
        if (!player) {  
            res.status(404).send(`Player not found: ${id}, or insufficient balance`);
            return;
        }
        res.status(201).send(player);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}); 

teamRouter.post("/sell", async (
    req: Request<{}, {}, { id: number }>,
    res: Response<Player | string>
) => {
    try {
        const id = req.body.id;
        if (typeof(id) != "number"  || id < 0 || !Number.isInteger(id)) {
            res.status(400).send(`Bad POST call to ${req.originalUrl} --- id has type ${typeof(id)} and value ${id}`);
            return;
        }

        const player = await teamService.sellPlayer(id);
        if (!player) {  
            res.status(404).send(`Player not found: ${id}`);
            return;
        }
        res.status(201).send(player);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}); 