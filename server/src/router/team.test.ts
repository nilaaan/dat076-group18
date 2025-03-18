import * as SuperTest from "supertest";
import { app } from "../start";
import exp from "constants";
import { PlayerService } from "../service/player";
import { PlayerModel } from "../db/player.db";

const session = require("supertest-session");
const request = session(app);

export const addAllPlayers = async () => {
    const playerService = new PlayerService();
    const players = await playerService.getPlayers();

    // Add all players to the PlayerModel table before running the tests
    for (const player of players) {
        await PlayerModel.create(player);
    }
};


test("if all players of the user's team are requested then all players should be returned", async () => {

    await addAllPlayers();

    const registered_user = await request.post("/user").send({username: "testUser", password: "testPassword"});
    const logged_user = await request.post("/user/login").send({username: "testUser", password: "testPassword"});

    const res1 = await request.post("/team/1").send({action: "buy"});   // balance now 99999990
    const res2 = await request.post("/team/3").send({action: "buy"});  // balance now 99999985

    const res = await request.get("/team/players");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
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
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 5,
            image: "img3",
        }]);
}); 

test("if the balance of the user's team is requested then the correct balance should be returned", async () => {
    const res = await request.get("/team/balance");
    expect(res.statusCode).toEqual(200);
    expect(res.body.balance).toEqual(99999985);
}); 

test("if a request to buy a player is made then the player should be added to the team and a copy of the player returned", async () => {
    const res = await request.post("/team/4").send({action: "buy"});    // balance now 999999980
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(
    {
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 5,
        image: "img4",
    });
    
    // unecessary testing ? (tests logic covered in service test)
    const res2 = await request.get("/team/players");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toEqual([
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
        }]);

        const res3 = await request.get("/team/balance");
        expect(res3.statusCode).toEqual(200);
        expect(res3.body.balance).toEqual(99999980);

});

test("if a request to sell a player is made then the player  should be removed from the team and a copy of the player returned", async () => {
    const res = await request.post("/team/4").send({action: "sell"});   // balance now 99999985
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(        
    {   
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 5,
        image: "img4",
    }); 

    // unecessary ?
    const res2 = await request.get("/team/players");
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toEqual([
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
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 5,
            image: "img3",
        }]);

    
    const res3 = await request.get("/team/balance");
    expect(res3.statusCode).toEqual(200);
    expect(res3.body.balance).toEqual(99999985);
}); 

test("if a request to buy/sell a player is made with an invalid id then an error should be returned", async () => {

    const res1 = await request.post("/team/invalid").send({action: "buy"});
    expect(res1.statusCode).toEqual(400);

    const res2 = await request.post("/team/-3").send({action: "buy"});
    expect(res2.statusCode).toEqual(400);
}); 

test("if a request to buy/sell a player is made with a missing or invalid action then an error should be returned", async () => {

    const res1 = await request.post("/team/4")
    expect(res1.statusCode).toEqual(400);
    
    const res2 = await request.post("/team/4").send({action: 4});
    expect(res2.statusCode).toEqual(400);

    const res3 = await request.post("/team/4").send({action: "invalid"});
    expect(res3.statusCode).toEqual(400);
}); 

test("if a request to buy or sell a player is not possible because of the model state then an error should be retuernd", async () => {
    const res = await request.post("/team/5").send({action: "buy"});    // e.g. insufficient balance
    expect(res.statusCode).toEqual(404);

    const res2 = await request.post("/team/5000").send({action: "sell"});   // e.g. player not in team
    expect(res2.statusCode).toEqual(404);
});




