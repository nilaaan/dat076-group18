import express, { Request, Response, Router } from "express";
import { IGameSessionService } from "../service/game_session.interface";


export function gamesessionRouter(gameSessionService: IGameSessionService): Router {
    const gamesessionRouter = express.Router();

    gamesessionRouter.post("/:userId", async (
        req: Request<{ userId: string }, {}, {}>,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.userId) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const user_id = parseInt(req.params.userId, 10);
            if (!Number.isInteger(user_id) || user_id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            await gameSessionService.startGameSession(user_id);
            res.status(200).send("Game session started");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/:userId", async (
        req: Request<{ userId: string }, {}, {}>,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.userId) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const user_id = parseInt(req.params.userId, 10);
            if (!Number.isInteger(user_id) || user_id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            const isGameSession = await gameSessionService.isGameSession(user_id);
            res.status(200).send(isGameSession);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/:userId/finished", async (
        req: Request<{ userId: string }, {}, {}>,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.userId) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const user_id = parseInt(req.params.userId, 10);
            if (!Number.isInteger(user_id) || user_id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            const isGameSessionFinished = await gameSessionService.isGameSessionFinished(user_id);
            if (isGameSessionFinished === undefined) {
                res.status(404).send(`No game session found for user ${user_id}`);
                return;
            }
            res.status(200).send(isGameSessionFinished);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/:userId/matchesActive", async (
        req: Request<{ userId: string }, {}, {}>,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.userId) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const user_id = parseInt(req.params.userId, 10);
            if (!Number.isInteger(user_id) || user_id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            const isMatchesInProgress = await gameSessionService.isMatchesInProgress(user_id);
            if (isMatchesInProgress === undefined) {
                res.status(404).send(`No game session found for user ${user_id}`);
            }
            res.status(200).send(isMatchesInProgress);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/:userId/round", async (
        req: Request<{ userId: string }, {}, {}>,
        res: Response<number | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.userId) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const user_id = parseInt(req.params.userId, 10);
            if (!Number.isInteger(user_id) || user_id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            const round = await gameSessionService.getUserRound(user_id);
            if (!round) {
                res.status(404).send(`No game session found for user ${user_id}`);
                return;
            }
            res.status(200).send(round);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.put("/:userId/state", async (
        req: Request<{ userId: string }, {}, {}>,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.userId) {
                res.status(400).send(`Missing id param`);
                return;
            }
            const user_id = parseInt(req.params.userId, 10);
            if (!Number.isInteger(user_id) || user_id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }
            const isUpdated = await gameSessionService.updateState(user_id);
            if(isUpdated === undefined){
                res.status(404).send(`No game session found for user ${user_id}`);
                return;
            }
            res.status(200).send("Game session state updated");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    
    return gamesessionRouter;
};
