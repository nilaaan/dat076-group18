import * as SuperTest from "supertest";
import { app } from "../start";


const request = SuperTest.default(app);

// we want to test: GET /players
// 