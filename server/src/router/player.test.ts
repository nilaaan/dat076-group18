import * as SuperTest from "supertest";
import { app } from "../start";
import { PlayerService } from "../service/player";
import { PlayerModel } from "../db/player.db";
import { addPlayers, addRatings } from "../service/addPlayers";
import { RatingModel } from "../db/rating.db";


const request = SuperTest.default(app);

export const addAllPlayers = async () => {
    const playerService = new PlayerService();
    const players = await playerService.getPlayers();

    // Add all players to the PlayerModel table before running the tests
    for (const player of players) {
        await PlayerModel.create(player);
    }
}

export const addAllRatings = async () => {
    const players = [1, 2, 3, 4, 5]; // Player IDs
    const totalRounds = 38; // Number of rounds

    for (const player_id of players) {
        for (let round = 1; round <= totalRounds; round++) {
            const randomRating = parseFloat((Math.random() * 9 + 1).toFixed(1)); // Random float between 1-10
            await RatingModel.create({
                player_id,
                round,
                rating: randomRating,
            });
        }
    }

    console.log("All ratings added successfully.");
};



test("if all players are requested then all players should be returned", async () => {
    
    await addAllPlayers();
    await addAllRatings();

    const res = await request.get("/player");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual( [ 
        {
            id: 1, 
            name: "Test player1",
            position: "Attacker",
            number: 10,
            club: "Test Club",
            price: 10,
            image: "img1",
        },
        {
            id: 2, 
            name: "Test player2",
            position: "Attacker",
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
        position: "Attacker",
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


test("top performers should be returned", async () => {
    const res = await request.get("/player/performance/1");
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
    console.log(typeof(res.body));
});

test("No top performers for round 100", async () => {


    const res = await request.get("/player/performance/100");
    expect(res.statusCode).toEqual(400);

});


test("Rating of specified player should be returned", async () => {

    const res = await request.get("/player/1/rating/1");
    expect(res.statusCode).toEqual(200);
    console.log(res.body);
    console.log(typeof(res.body));
});

test("Rating of non-existing player should return 404", async () => {

    const res = await request.get("/player/100/rating/1");
    expect(res.statusCode).toEqual(404);

});

test("Rating of existing player for non-existing round should return 400", async () => {

    const res = await request.get("/player/1/rating/100");
    expect(res.statusCode).toEqual(400);

});

test("Availability of existing player for existing round should return 200", async () => {

    const res = await request.get("/player/1/availability/1");
    expect(res.statusCode).toEqual(200);

});

test("Availability of non-existing player for existing round should return 404", async () => {

    const res = await request.get("/player/100/availability/1");
    expect(res.statusCode).toEqual(404);

});

test("Availability of existing player for non-existing round should return 400", async () => {

    const res = await request.get("/player/1/availability/100");
    expect(res.statusCode).toEqual(400);

});

test("Form of existing player for existing round should return 200", async () => {

    const res = await request.get("/player/1/form/3");
    console.log("res", res.body);
    expect(res.statusCode).toEqual(200);

});

test("Form of non-existing player for existing round should return 404", async () => {

    const res = await request.get("/player/100/form/2");
    expect(res.statusCode).toEqual(404);

});

test("Form of existing player for non-existing round should return 400", async () => {

    const res = await request.get("/player/1/form/100");
    expect(res.statusCode).toEqual(400);

});