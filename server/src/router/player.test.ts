import * as SuperTest from "supertest";
import { app } from "../start";
import { PlayerService } from "../service/player";
import { PlayerModel } from "../db/player.db";


const request = SuperTest.default(app);

export const addAllPlayers = async () => {
    const playerService = new PlayerService();
    const players = await playerService.getPlayers();

    // Add all players to the PlayerModel table before running the tests
    for (const player of players) {
        await PlayerModel.create(player);
    }
}

test("if all players are requested then all players should be returned", async () => {
    
    await addAllPlayers();

    const res = await request.get("/player");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual( [ 
        {
            id: 1, 
            name: "Test player1",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 10,
            image: "img1",
        },
        {
            id: 2, 
            name: "Test player2",
            position: "Forward",
            number: 9,
            club: "Test Club",
            price: 10,
            image: "img2",
        },
        {
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 5,
            image: "img3",
        },
        {
            id: 4, 
            name: "Test player4",
            position: "Defender",
            number: 5,
            club: "Test Club",
            price: 5,
            image: "img4",
        },
        {
            id: 5, 
            name: "Test player5",
            position: "Midfielder",
            number: 10,
            club: "Test Club",
            price: 200000000,
            image: "img5",
        }
    ]);
});


test("If a specific player is requested then it should be returned", async () => {

    const player1 = 
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        image: "img1",
    }; 
    const res = await request.get(`/player/${player1.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual( player1 );
});


test("If a specific player is requested with an invalid id then an error should be returned", async () => {
    const res = await request.get("/player/invalid");
    expect(res.statusCode).toEqual(400);
});

test("If a player that does not exist is requested then an error should be returned", async () => {
    const res = await request.get("/player/100");
    expect(res.statusCode).toEqual(404);
}); 