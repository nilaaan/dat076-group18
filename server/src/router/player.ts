import express, { Request, Response, Router } from "express";
import { PlayerService } from '../service/player';
import { Player } from '../model/player.interface';


export function playerRouter(playerService: PlayerService): Router {
    const playerRouter = express.Router();
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
            const player = await playerService.getPlayer(parseInt(req.params.id));
            console.log(player);
            res.status(200).send(player);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    return playerRouter;

}

