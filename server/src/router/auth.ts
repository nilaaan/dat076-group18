import express, { Request, Response, Router } from "express";
import { AuthService } from "../service/auth";


export function authRouter(authService: AuthService): Router {
    const authRouter = express.Router();
    // Register user

    authRouter.post("/", async (
        req: Request<{}, {}, { username: string, password: string }>,
        res: Response
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

            const newUser = await authService.registerUser(username, password);
            if (!newUser) {
                res.status(409).send("Username already exist");
                return;
            }
            res.status(201).send(newUser);

        } catch (e: any) {
            res.status(500).send(e.message);
        }
    });

    // Login user
    authRouter.post("/login", async (
        req: Request<{}, {}, { username: string, password: string }>,
        res: Response
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

            const isValidUser = await authService.findUser(username, password);
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

    // Logout user
    authRouter.post("/logout", (
        req: Request,
        res: Response
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