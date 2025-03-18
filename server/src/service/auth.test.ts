import { AuthService } from './auth';
import bcrypt from 'bcrypt';


test("if a user registers then a user should be created with the given username and password, and default team attributes", async () => {
    const authService = new AuthService();
    const user = await authService.registerUser("testUser", "testPassword");
    if (!user) {
        throw new Error("User was not created");
    }

    const isPasswordValid = await bcrypt.compare("testPassword", user.password); 

    expect(isPasswordValid).toBe(true);
    expect(user).toEqual({ id: 1, username: "testUser", password: expect.any(String), team: { players: [], balance: 100000000, points: 0 } });
    expect(authService.users).toContain(user);
});


test("if a user registers with an already existing username then no user should be created", async () => {
    const authService = new AuthService();
    const user1 = await authService.registerUser("testUser", "testPassword");
    expect(authService.users).toContain(user1);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const user2 = await authService.registerUser("testUser", "otherTestPassword");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(user2).toBeNull();
    
}); 


test("if a user logs in then the corresponding user object should be returned", async () => {
    const authService = new AuthService();
    const user = await authService.registerUser("testUser", "testPassword");
    expect(authService.users).toContain(user);
    const loggedInUser = await authService.findUser("testUser", "testPassword");
    expect(loggedInUser).toEqual(user);
});


test("if a user logs in with a non-existing username then no user should be returned", async () => {
    const authService = new AuthService();
    expect(authService.users).toEqual([]);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const user = await authService.findUser("testUser", "testPassword");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(user).toBeNull();
});


test("if a user logs in with a wrong password then no user should be returned", async () => {
    const authService = new AuthService();
    const user = await authService.registerUser("testUser", "testPassword");
    expect(authService.users).toContain(user)
    
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const logged_user = await authService.findUser("testUser", "wrongPassword");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
    expect(logged_user).toBeNull();;
}); 


test("if a user is identified by username only then the corresponding user object should be returned", async () => {
    const authService = new AuthService();
    const user = await authService.registerUser("testUser", "testPassword");
    expect(authService.users).toContain(user);
    const identifiedUser = await authService.findUser("testUser");
    expect(identifiedUser).toEqual(user);
}); 