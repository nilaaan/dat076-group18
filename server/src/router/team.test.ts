import * as SuperTest from "supertest";
import { app } from "../start";
import exp from "constants";


const request = SuperTest.default(app);

test("if all players of the user's team are requested then all players should be returned", async () => {
    const res = await request.get("/team/players");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
        {   
            id: 1, 
            name: "Test player1",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 1000000,
            available: false,
            points: 0
        }, {
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 500000,
            available: false,
            points: 0
        }]);
}); 

test("if the balance of the user's team is requested then the correct balance should be returned", async () => {
    const res = await request.get("/team/balance");
    expect(res.statusCode).toEqual(200);
    expect(res.body.number).toEqual(100000000);
}); 

test("if a player is bought to the user's team then it should be added to the team and a copy of the player returned", async () => {
    const res = await request.post("/team/4").send({action: "buy"});
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 500000,
        available: false,
        points: 0
    });
});

test("if a player is sold from the user's team then it should be removed from the team and a copy of the player returned", async () => {
    const res = await request.post("/team/1").send({action: "sell"});
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: true,
        points: 0
    }); 
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


