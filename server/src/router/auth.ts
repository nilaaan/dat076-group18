import express, { Request, Response, Router } from "express";
import { AuthService } from "../service/auth";
import { IUserService } from "../service/user.interface";
import { User } from "../model/user.interface";


export function authRouter(userService: IUserService): Router {
    const authRouter = express.Router();
    
    // Registers a user with the given username and password
    // Sends the user if the registration was successful
    authRouter.post("/", async (
        req: Request<{}, {}, { username: string, password: string }>,
        res: Response<User | string>
    ) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).send("Missing username or password");
                return;
            }

            if (typeof username !== "string" || typeof password !== "string") {
                res.status(400).send("Username and password must be strings");
                return;
            }

            const newUser = await userService.registerUser(username, password);
            if (!newUser) {
                res.status(409).send("Username already exist");
                return;
            }
            res.status(201).send(newUser);

        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    // Logs the user in with the given username and password 
    // Updates the user's gamesession state and sneds the user if the user exists and the password is correct
    authRouter.post("/login", async (
        req: Request<{}, {}, { username: string, password: string }>,
        res: Response<string>
    ) => {
        try {
            const { username, password } = req.body;

            if (req.session.user) {
                res.status(400).send("You are already logged in");
                return;
            }

            if (!username || !password) {
                res.status(400).send("Missing username or password");
                return;
            }
            
            if (typeof username !== "string" || typeof password !== "string") {
                res.status(400).send("Username and password must be strings");
                return;
            }

            const isValidUser = await userService.findUser(username, password);
            if (!isValidUser) {
                res.status(401).send("Invalid username or password");
                return;
            }

            req.session.user = { username };
            res.status(200).send(`Logged in as ${username}`);

        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    // Logs the current user out 
    // Sends a 200 status if the user is logged out successfully
    authRouter.post("/logout", (
        req: Request,
        res: Response<string>
    ) => {
        req.session.destroy((err) => {
            if (err) {
                console.error(`Error destroying session: ${err}`);
                return res.status(500).send("Failed to log out.");
            }

            res.status(200).send();
            console.log("Logged out successfully.");
        });
    });

    // Check if logged in or not
    authRouter.get("/check-session", (
        req: Request,
        res: Response
    ) => {
        if (req.session.user) {
            res.json({ loggedIn: true, user: req.session.user });
        } else {
            res.json({ loggedIn: false });
        }
    });

    return authRouter;
}