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
    res: Response<{ number: Number } | String>
) => {
    try {
        const number = await teamService.getBalance();
        res.status(200).send({number}); 
    } catch (e: any) {
        res.status(500).send(e.message);
        console.error(e.message);
    }
}); 

teamRouter.post("/:id", async (
    req: Request<{ id: string }, {}, { action: string }>,
    res: Response<Player | String>
) => {
    try {
        if (req.params.id == null) {
            res.status(400).send(`Missing id param`);
            return;
        }
        if (typeof(req.body.action) !== "string") {
            res.status(400).send(`Field 'action' has type ${typeof(req.body.action)}`);
            return;
        }
        const id = parseInt(req.params.id, 10);
        if (! (id >= 0)) {
            res.status(400).send(`id number must be a non-negative integer`);
            return;
        }

        const { action } = req.body;
        if (action === "buy") {
            const player = await teamService.buyPlayer(id);
            if (!player) {  
                res.status(404).send(`Player ${id} unavailable, too expensive, already bought, or not found:`);
                return;
            }
            res.status(201).send(player);
        } else if (action === "sell") {
            const player = await teamService.sellPlayer(id);
            if (!player) {  
                res.status(404).send(`Player not found: ${id}`);
                return;
            }
            res.status(201).send(player);
        } else {
            res.status(400).send(`Invalid action: ${action}`);
        }
    } catch (e: any) {
        res.status(500).send(e.message);
    }
}); 

