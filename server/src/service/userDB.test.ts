import { AuthService } from './auth';
import bcrypt from 'bcrypt';
import { UserDBService } from "./userDB";
import { GameSessionService } from "./game_session";

test("if a user registers then a user should be created with the given username and password", async () => {
    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);

    const user = await userDBService.registerUser("testUser", "testPassword");
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
    const gameSessionService = new GameSessionService();
    const userDBService = new UserDBService(gameSessionService);
    const expectedUser = await userDBService.findUser("testUser");

    expect(expectedUser).toEqual({ id: 1, username: "testUser", password: expect.any(String), team: { players: [], balance: 100000000, points: 0 } });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const user2 = await userDBService.registerUser("testUser", "othertestPassword");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(user2).toBeNull();
    
}); 

