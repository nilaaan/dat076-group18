import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../service/auth";

export const authRouter = express.Router();

// Register user
authRouter.post("/register", async (
    req: Request<{}, {}, { username: string, password: string }>,
    res: Response
) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send("Missing username or password");
            return;
        }

        const newUser = await registerUser(username, password);
        if (!newUser) {
            res.status(409).send("Username already exist");
            return;
        }
        res.status(201).send(newUser);

    } catch (e: any) {
        res.status(500).send(e.message);
    }
});

authRouter.post("/login", async (
    req: Request<{}, {}, { username: string, password: string }>,
    res: Response
) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).send("Missing username or password");
            return;
        }

        const isValidUser = await loginUser(username, password);
        if (!isValidUser) {
            res.status(401).send("Invalid username or password");
            return;
        }
        
        req.session.user = { username }
        res.status(200).send(`Logged in as ${username}`);
        
    } catch (e: any) {
        res.status(500).send(e.message);
    }
});