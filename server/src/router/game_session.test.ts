import * as SuperTest from "supertest";
import { app } from "../start";
import exp from "constants";
import { PlayerService } from "../service/player";
import { PlayerModel } from "../db/player.db";
import e from "express";

const session = require("supertest-session");
const request = session(app);


test("isGameSession() on a non-existing user should return 401", async () => {
    const is_game = await request.get("/gamesession");

    expect(is_game.statusCode).toEqual(401);
}); 


test("isGameSession() on an existing user before it has started a gamesession should return 200 and its body equal false", async () => {
    await request.post("/user").send({username: "testUser", password: "testPassword"});
    await request.post("/user/login").send({username: "testUser", password: "testPassword"});

    const is_game = await request.get("/gamesession");

    expect(is_game.statusCode).toEqual(200);
    expect(is_game.body).toEqual(false);
}); 


test("startGameSession() with a non-existing user should return 401 ", async () => {
    await request.post("/user/logout");
    const start_game = await request.post("/gamesession");

    expect(start_game.statusCode).toEqual(401);
}); 


test("is an existing user starts a game session, a 200 response should be returned and its body should be equal to true ", async () => {
    await request.post("/user/login").send({username: "testUser", password: "testPassword"});

    const start_game = await request.post("/gamesession");

    expect(start_game.statusCode).toEqual(200);
    expect(start_game.body).toEqual(true);
}); 


test("isGameSession() on an existing user after it has started a gamesession should return 200 and its body equal true", async () => {
    const is_game = await request.get("/gamesession");

    expect(is_game.statusCode).toEqual(200);
    expect(is_game.body).toEqual(true);
}); 


test("getRound() on an existing user should return a 200 response and the current round of the user's gamesession", async () => {
    const current_round = await request.get("/gamesession/round");

    expect(current_round.statusCode).toEqual(200);
    expect(current_round.body).toEqual(1);
}); 


test("getRound() on a non-existing user should return 401", async () => {
    await request.post("/user/logout");
    const current_round = await request.get("/gamesession/round");

    expect(current_round.statusCode).toEqual(401);
}); 


test("getLeadeboard() on an existing user should return a 200 response and a list of usernames and points of the users sharing the same gamesession as the current logged in user", async () => {
    await request.post("/user").send({username: "testUser2", password: "testPassword2"});
    await request.post("/user/login").send({username: "testUser2", password: "testPassword2"});
    await request.post("/gamesession");
    await request.post("/user/logout");

    await request.post("/user").send({username: "testUser3", password: "testPassword3"});
    await request.post("/user/login").send({username: "testUser3", password: "testPassword3"});
    await request.post("/gamesession");
    await request.post("/user/logout");

    await request.post("/user/login").send({username: "testUser", password: "testPassword"});

    const leaderboard = await request.get("/gamesession/leaderboard");

    expect(leaderboard.statusCode).toEqual(200);
    expect(leaderboard.body).toEqual([["testUser", 0], ["testUser2", 0], ["testUser3", 0]]);
}); 



test("getLeaderboard() on a user without gamesession should retutn 404", async () => {
    await request.post("/user").send({username: "testUser4", password: "testPassword4"});
    await request.post("/user/login").send({username: "testUser4", password: "testPassword4"});
    const leaderboard= await request.get("/gamesession/leadeboard");

    expect(leaderboard.statusCode).toEqual(404);
}); 







