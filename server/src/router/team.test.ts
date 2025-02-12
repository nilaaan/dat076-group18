import * as SuperTest from "supertest";
import { app } from "../start";


const request = SuperTest.default(app);

// we want to test: GET /players,
// GET /balance
// POST /buyPlayer() happy path and error conditions
// POST /sellPlayer() happy path and error conditions