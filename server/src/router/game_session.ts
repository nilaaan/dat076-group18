import express, { Request, Response, Router } from "express";
import { IGameSessionService } from "../service/game_session.interface";


export function gamesessionRouter(gameSessionService: IGameSessionService): Router {
    const gamesessionRouter = express.Router();


    gamesessionRouter.post("/", async (
        req: Request,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            const isStarted = await gameSessionService.startGameSession(req.session.user.username);
            if (isStarted === undefined) {
                console.log("user logged in as " + req.session.user.username + " no longer exists");
                delete req.session.user;
                res.status(401).send(`Not logged in`);
                return;
            }
            res.status(200).send(isStarted);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/", async (
        req: Request,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            const isGameSession = await gameSessionService.isGameSession(req.session.user.username);
            if (isGameSession === undefined) {
                console.log("user logged in as " + req.session.user.username + " no longer exists");
                delete req.session.user;
                res.status(401).send(`Not logged in`);
                return;
            }
            res.status(200).send(isGameSession);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/finished", async (
        req: Request,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            const isGameSessionFinished = await gameSessionService.isGameSessionFinished(req.session.user.username);
            if (isGameSessionFinished === undefined) {
                res.status(404).send(`No game session found for user ${req.session.user.username}`);
                return;
            }
            res.status(200).send(isGameSessionFinished);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/matchesActive", async (
        req: Request,
        res: Response<boolean | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            const isMatchesInProgress = await gameSessionService.isMatchesInProgress(req.session.user.username);
            if (isMatchesInProgress === undefined) {
                res.status(404).send(`No game session found for user ${req.session.user.username}`);
                return;
            }
            res.status(200).send(isMatchesInProgress);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/round", async (
        req: Request,
        res: Response<number | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }

            const round = await gameSessionService.getRound(req.session.user.username);
            if (!round) {
                res.status(404).send(`No game session found for user ${req.session.user.username}`);
                return;
            }
            res.status(200).json(round);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.put("/state", async (
        req: Request,
        res: Response<string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }

            const isUpdated = await gameSessionService.updateState(req.session.user.username);
            if (isUpdated === undefined){
                res.status(404).send(`No game session found for user ${req.session.user.username}`);
                return;
            }
            res.status(200).send("Game session state updated");
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });


    gamesessionRouter.get("/leaderboard", async (
        req: Request,
        res: Response<[string, number][] | string>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }

            const leaderboard = await gameSessionService.getLeaderboard(req.session.user.username);
            if (!leaderboard) {
                res.status(404).send(`Couldn't get leaderboard for user: ${req.session.user.username}`);
                return;
            }
            res.status(200).send(leaderboard);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    
    return gamesessionRouter;
};
