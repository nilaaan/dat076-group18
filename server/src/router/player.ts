import express, { Request, Response } from "express";
import { PlayerService } from '../service/player';
import { Player } from '../model/player.interface';

const playerService = new PlayerService();

export const playerRouter = express.Router();


playerRouter.get("/", async (
    req: Request,
    res: Response<{ players: Array<Player> } | String>
) => {
    try {
        const players = await playerService.getPlayers();
        res.status(200).send({ players: players });
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

playerRouter.post("/player", async (
    req: Request<{}, {}, { player: Player }>,
    res: Response<String>
) => {
    try {
        const player: Player = req.body.player;
        await playerService.addPlayer(player);
        res.status(201).send(`Added player ${player.name}`);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});


