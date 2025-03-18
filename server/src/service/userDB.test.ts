import bcrypt from 'bcrypt';
import { UserDBService } from "./userDB";


test("if a user registers then a user should be created with the given username and password", async () => {

    
    const userDBService = new UserDBService();

    const user = await userDBService.registerUser("testUser", "testPassword");
    console.log(user);
    if (!user) {
        throw new Error("User was not created");
    }


    const expectedUser = await userDBService.findUser("testUser");
    expect(expectedUser).not.toBeNull();
    if (expectedUser != null) {
    const isPasswordValid = await bcrypt.compare("testPassword", expectedUser.password); 
    expect(isPasswordValid).toBe(true);
    }
    expect(expectedUser).toEqual({ id: 1, username: "testUser", password: expect.any(String), team: { players: [], balance: 100000000, points: 0 } });
});


test("if a user registers with an already existing username then no user should be created", async () => {

    const userDBService = new UserDBService();
    const expectedUser = await userDBService.findUser("testUser");

    expect(expectedUser).toEqual({ id: 1, username: "testUser", password: expect.any(String), team: { players: [], balance: 100000000, points: 0 } });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const user2 = await userDBService.registerUser("testUser", "othertestPassword");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(user2).toBeNull();
    
}); 

test("If a user logs in then the corresponding user object should be returned", async () => {

    const userDBService = new UserDBService();
    const user2 = await userDBService.registerUser("testUser2", "testPassword2");
    const expectedUser = await userDBService.findUser("testUser2");
    
    expect(expectedUser).toEqual(user2);

});


test("if a user logs in with a non-existing username then no user should be returned", async () => {

    const userDBService = new UserDBService();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const expectedUser = await userDBService.findUser("testUser3");

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(expectedUser).toBeNull();
});


test("if a user logs in with a wrong password then no user should be returned", async () => {

    const userDBService = new UserDBService();
    const expectedUser = await userDBService.findUser("testUser2");
    expect(expectedUser).not.toBeNull();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const wrongLogin = await userDBService.findUser("testUser2", "wrongpwd");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(wrongLogin).toBeNull();;
}); 


