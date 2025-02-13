import * as SuperTest from "supertest";
import { app } from "../start";


const request = SuperTest.default(app);

test("if all players are requested then all players should be returned", async () => {
    const res = await request.get("/player");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([
        {   
            id: 1, 
            name: "Test player1",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 1000000,
            available: true,
            points: 0
        },{
            id: 2, 
            name: "Test player2",
            position: "Forward",
            number: 9,
            club: "Test Club",
            price: 1000000,
            available: false,
            points: 0
        },{
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 500000,
            available: false,
            points: 0
        },{
            id: 4, 
            name: "Test player4",
            position: "Defender",
            number: 5,
            club: "Test Club",
            price: 500000,
            available: true,
            points: 0
        },{
            id: 5, 
            name: "Test player5",
            position: "Midfielder",
            number: 10,
            club: "Test Club",
            price: 200000000,
            available: true,
            points: 0
        }]);
});