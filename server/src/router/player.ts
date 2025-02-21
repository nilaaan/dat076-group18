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


playerRouter.get("/:id", async (
    req: Request<{ id: string }, {}, {}>,
    res: Response<Player | String>
) => {
    try {
        if (req.params.id == null) {
            res.status(400).send(`Missing id param`);
            return;
        }
        const id = parseInt(req.params.id, 10);
        if (! (id >= 0)) {
            res.status(400).send(`id number must be a non-negative integer`);
            return;
        }
        
        const player = await playerService.getPlayer(parseInt(req.params.id));
        if (!player) {
            res.status(404).send(`Player ${req.params.id} not found`);
            return;
        }
        res.status(200).send(player);
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

