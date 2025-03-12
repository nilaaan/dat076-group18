import express, { Request, Response, Router } from "express";
import { TeamService } from '../service/team';
import { Team } from '../model/team.interface';
import { PlayerService } from '../service/player';
import { Player } from '../model/player.interface';
import { AuthService } from '../service/auth';
import { ITeamService } from "../service/team.interface";


export function teamRouter(teamService: ITeamService): Router {
    const teamRouter = express.Router();

    teamRouter.get("/players", async (
        req: Request,
        res: Response<Array<Player> | String>
    ) => {
        try {
            if (!req.session?.user) {
                console.log(req.session.user)
                res.status(401).send("Not logged in");
                return;
            }
            const players = await teamService.getPlayers(req.session.user.username);
            if (!players) {
                console.log("user logged in as " + req.session.user.username + " no longer exists");
                delete req.session.user;
                res.status(401).send("Not logged in");
                return;
            }
            res.status(200).send(players);
        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    teamRouter.get("/balance", async (
        req: Request,
        res: Response<{ balance: Number } | String>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            const balance = await teamService.getBalance(req.session.user.username);
            if (!balance) {
                console.log("user logged in as " + req.session.user.username + " no longer exists");
                delete req.session.user;
                res.status(401).send("Not logged in");
                return;
            }
            res.status(200).send({ balance });
        } catch (e: any) {
            res.status(500).send(e.message);
            console.error(e.message);
        }
    });

    teamRouter.get("/points", async (
        req: Request,
        res: Response<{ points: Number } | String>
    ) => {
        try {
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            const points = await teamService.getPoints(req.session.user.username);
            if (!points) {
                console.log("user logged in as " + req.session.user.username + " no longer exists");
                delete req.session.user;
                res.status(401).send("Not logged in");
                return;
            }
            res.status(200).send({ points });
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
            if (!req.session?.user) {
                res.status(401).send("Not logged in");
                return;
            }
            if (!req.params.id) {
                res.status(400).send(`Missing id param`);
                return;
            }
            if (typeof (req.body.action) !== "string") {
                res.status(400).send(`Field 'action' has type ${typeof (req.body.action)}`);
                return;
            }
            const id = parseInt(req.params.id, 10);
            if (!Number.isInteger(id) || id < 0) {
                res.status(400).send(`id number must be a non-negative integer`);
                return;
            }

            const { action } = req.body;
            if (action === "buy") {
                const player = await teamService.buyPlayer(req.session.user.username, id);
                if (!player) {
                    res.status(404).send(`Player ${id} unavailable, too expensive, already bought, or not found:`);
                    return;
                }
                res.status(201).send(player);
            } else if (action === "sell") {
                const player = await teamService.sellPlayer(req.session.user.username, id);
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
    })

    return teamRouter;
}



