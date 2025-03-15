import * as SuperTest from "supertest";
import { app } from "../start";
import exp from "constants";
import { PlayerService } from "../service/player";
import { PlayerModel } from "../db/player.db";
import e from "express";

const session = require("supertest-session");
const request = session(app);


test("is game before ", async () => {

    const registered_user = await request.post("/user").send({username: "testUser", password: "testPassword"});
    const logged_user = await request.post("/user/login").send({username: "testUser", password: "testPassword"});

    const is_game = await request.get("/gamesession");

    expect(is_game.statusCode).toEqual(200);
    expect(is_game.body).toEqual(false);

}); 


test("is game after ", async () => {

    const start_game = await request.post("/gamesession");

    const is_game = await request.get("/gamesession");

    expect(is_game.statusCode).toEqual(200);
    expect(is_game.body).toEqual(true);

}); 

test("get current round", async () => {

    const current_round = await request.get("/gamesession/round");

    expect(current_round.statusCode).toEqual(200);
    expect(current_round.body).toEqual(1);

}); 




