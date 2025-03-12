import express, { Request, Response, Router } from "express";
import { IPlayerService } from "../service/player.interface";

import { Player } from '../model/player.interface';


export function playerRouter(playerService: IPlayerService): Router {
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
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const id = parseInt(req.params.id, 10);
            if (!Number.isInteger(id) || id < 0) {
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


    playerRouter.get("/:id/rating", async (
        req: Request<{ id: string }, {}, {}>,
        res: Response<number | string | null>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const id = parseInt(req.params.id, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }

            const last_match_rating = await playerService.getLastMatchRating(id, req.session.user.username);
            if (last_match_rating === undefined) {
                res.status(404).send(`User ${req.session.user.username} does not have a game session`);
                return;
            }
            res.status(200).send(last_match_rating);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    playerRouter.get("/:id/availability", async (
        req: Request<{ id: string }, {}, {}>,
        res: Response<boolean | string >
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const id = parseInt(req.params.id, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }

            const next_match_availability = await playerService.getNextMatchAvailability(id, req.session.user.username);
            if (next_match_availability === undefined) {
                res.status(404).send('Could not find availability');
                return;
            }
            res.status(200).send(next_match_availability);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    playerRouter.get("/:id/form", async (
        req: Request<{ id: string }, {}, {}>,
        res: Response<number | string | null>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const id = parseInt(req.params.id, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }

            const recent_form = await playerService.getRecentForm(id, req.session.user.username);
            if (recent_form === undefined) {
                res.status(404).send(`User ${req.session.user.username} does not have a game session`);
                return;
            }
            res.status(200).send(recent_form);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });
    
    return playerRouter;
};
