import express, { Request, Response } from "express";
import { PlayerService } from '../service/player';
import { Player } from '../model/player.interface';

const playerService = new PlayerService();

export const playerRouter = express.Router();


playerRouter.get("/", async (
    req: Request,
    res: Response<Array<Player> | String>
) => {
    try {
        const players = await playerService.getPlayers();
        res.status(200).send(players);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


