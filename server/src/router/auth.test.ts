import * as SuperTest from "supertest";
import { app } from "../start";
import exp from "constants";
import * as bcrypt from "bcrypt";
import e from "express";

const session = require("supertest-session");
const request = session(app);

test("if a user registers then that user should be registered and the user object returned ", async () => {
    const res = await request.post("/user").send({username: "testUser", password: "testPassword"});
    expect(res.statusCode).toEqual(201);

    const isPasswordValid = await bcrypt.compare("testPassword", res.body.password); 
    expect(isPasswordValid).toBe(true);

    expect(res.body).toEqual({
        id: 1,
        username: "testUser",
        password: expect.any(String),
        team: {
            players: [],
            balance: 100000000,
            points: 0
        }
    })
}); 


test("if a user tries to register with a missing username or password then an error should be returned ", async () => {
    const res1 = await request.post("/user").send({password: "testPassword"});
    expect(res1.statusCode).toEqual(400);

    const res2 = await request.post("/user").send({username: "testUser"});
    expect(res2.statusCode).toEqual(400);
});


test("if a user tries to register with an already existing username then an error should be returned ", async () => {
    const res1 = await request.post("/user").send({username: "testUser", password: "testPassword"});
    expect(res1.statusCode).toEqual(409);
}); 


test("if a user logs in then the user should log in and the corresponding user object should be returned", async () => {
    const res = await request.post("/user/login").send({username: "testUser", password: "testPassword"});
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Logged in as testUser");
    await request.post("/user/logout");
}); 
   

test("if a user tries to log in with a missing username or password then an error should be returned", async () => {
    const res1 = await request.post("/user/login").send({password: "testPassword"});
    expect(res1.statusCode).toEqual(400);

    const res2 = await request.post("/user/login").send({username: "testUser"});
    expect(res2.statusCode).toEqual(400);
}); 


test("if a user tries to log in with a non-existing username or password then an error should be returned", async () => {
    const res1 = await request.post("/user/login").send({username: "nonExistingUser", password: "testPassword"});
    expect(res1.statusCode).toEqual(401);

    const res2 = await request.post("/user/login").send({username: "testUser", password: "nonExistingPassword"});
    expect(res2.statusCode).toEqual(401);   
}); 


test("if a user logs out then the user should log out", async () => {
    const res = await request.post("/user/login").send({username: "testUser", password: "testPassword"});
    expect(res.statusCode).toEqual(200);
    const res2 = await request.post("/user/logout");
    expect(res2.statusCode).toEqual(200);
});

