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


    playerRouter.get("/:id/rating/:round", async (
        req: Request<{ id: string; round: string }, {}, {}>,
        res: Response<number | string | null>
    ) => {
        try {
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            if (!req.params.round) {
                res.status(400).send(`Missing round param`);
                return;
            }

            const id = parseInt(req.params.id, 10);
            const round = parseInt(req.params.round, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            if (!Number.isInteger(round) || round < 0 || round > 38) {
                res.status(400).send(`round number must be a non-negative integer between 0 and 38`);
                return;
            }

            const round_rating = await playerService.getRoundRating(id, round);
            if (round_rating === undefined) {
                res.status(404).send(`Rating not found for player: ${id} in round: ${round}`);
                return;
            }
            res.status(200).send(round_rating);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    playerRouter.get("/:id/availability/:round", async (
        req: Request<{ id: string; round: string }, {}, {}>,
        res: Response<boolean | null | string >
    ) => {
        try {
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            if (!req.params.round) {
                res.status(400).send(`Missing round param`);
                return;
            }

            const id = parseInt(req.params.id, 10);
            const round = parseInt(req.params.round, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            if (!Number.isInteger(round) || round < 0 || round > 38) {
                res.status(400).send(`round number must be a non-negative integer between 0 and 38`);
                return;
            }

            const round_availability = await playerService.getRoundAvailability(id, round);
            if (round_availability === undefined) {
                res.status(404).send(`Rating not found for player: ${id} in round: ${round}`);
                return;
            }
            res.status(200).send(round_availability);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    playerRouter.get("/:id/form/:round", async (
        req: Request<{ id: string; round: string }, {}, {}>,
        res: Response<number | string | null>
    ) => {
        try {
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            if (!req.params.round) {
                res.status(400).send(`Missing round param`);
                return;
            }

            const id = parseInt(req.params.id, 10);
            const round = parseInt(req.params.round, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            if (!Number.isInteger(round) || round < 0 || round > 39) {
                res.status(400).send(`round number must be a non-negative integer between 0 and 39`);
                return;
            }

            const recent_form = await playerService.getRecentForm(id, round);
            if (recent_form === undefined) {
                res.status(404).send(`Rating not found for player: ${id} in round: ${round}`);
                return;
            }
            res.status(200).send(recent_form);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    
    playerRouter.get("/performance/:round", async (
        req: Request<{ round: string }, {}, {}>,
        res: Response<Player[] | string | null>
    ) => {
        try {

            if (!req.params.round) {
                res.status(400).send(`Missing round param`);
                return;
            }

            const round = parseInt(req.params.round, 10);
            if (!Number.isInteger(round) || round < 0 || round > 38) {
                res.status(400).send(`round number must be a non-negative integer between 0 and 38`);
                return;
            }

            const top_perfomers = await playerService.getTopPerformers(round);
            if (top_perfomers === undefined) {
                res.status(404).send(`Rating not found for players in round: ${round}`);
                return;
            }
            res.status(200).send(top_perfomers);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    
    return playerRouter;
};
