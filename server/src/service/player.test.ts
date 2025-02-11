import * as SuperTest from "supertest";
import { PlayerService } from "./player";
import { teamRouter } from "../router/team";
import { Player } from '../model/player.interface'; 
import { app } from "../start";

test("Testing that getPlayer returns the player added with addPlayer by id", async () => {
    const player = {
        id: 1,
        name: "Player Playersson",
        position: "CAM",
        number: 5,
        club: "gbg",
        price: 1000,
        available: true,
        points: 100
    };

    const playerService = new PlayerService();

    await playerService.addPlayer(player);
    const p = await playerService.getPlayer(player.id);

    expect(JSON.stringify(p) === JSON.stringify(player)).toBeTruthy();
})


const request = SuperTest.default(app);

test("Testing the routing by adding a player through /addPlayer and assuring it is added with /getPlayers", async () => {
    const player = {
        id: 1,
        name: "Player Playersson",
        position: "CAM",
        number: 5,
        club: "gbg",
        price: 1000,
        available: true,
        points: 100
    };

    const req = await request.post("/players/player").send({ player: player });
    expect(req.statusCode).toEqual(201);

    const res = await request.get("/players");

    expect(res.statusCode).toEqual(200);
    
    const players: Player[] = res.body.players;

    expect(players.some((p: Player) => JSON.stringify(p) === JSON.stringify(player))).toBeTruthy();
})