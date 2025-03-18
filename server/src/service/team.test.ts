import { TeamService } from './team';
import { PlayerService } from './player';
import { AuthService } from './auth';




test("if all players from the user's team are requested then all players should be returned", async () => {
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
    const player3 = 
    {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 5,
        image: "img3",
    };

    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());

    const player1copy = await teamService.buyPlayer("testUser", 1);  
    const player3copy = await teamService.buyPlayer("testUser", 3); 
    const players = await teamService.getPlayers("testUser");

    expect(players).toEqual([player1, player3]);
});


test("if the balance of the user's team is requested then the correct balance should be returned", async () => {
    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());

    const balance = await teamService.getBalance("testUser");

    expect(balance).toEqual(100000000);
});

test("if a player is bought then the player should be added to the user's team and marked unavailable, and the balance should be updated", async () => {
    const player4 = 
    {
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 5,
        image:"img4"
    };

    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());

    const player2copy = await teamService.buyPlayer("testUser", 4);    

    expect(player2copy).toEqual(player4);

    const players = await teamService.getPlayers("testUser");
    expect(players).toContainEqual(player4);

    const balance = await teamService.getBalance("testUser");
    expect(balance).toEqual(99999995);
});

test("if a player that is already in the user's team is bought, then the player should not be added and the balance should not be updated", async () => {
    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());

    await teamService.buyPlayer("testUser", 1); 
    await teamService.buyPlayer("testUser", 3);
    await teamService.buyPlayer("testUser", 4);

    let error;
    try {
        await teamService.buyPlayer("testUser", 4);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();

    const players = await teamService.getPlayers("testUser");
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
    const player3 = 
    {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 5,
        image: "img3",
    };
    const player4 =
    {
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 5,
        image: "img4",
    }
    expect(players).toEqual([player1, player3, player4]);

    const balance = await teamService.getBalance("testUser");
    expect(balance).toEqual(99999980);
});

test("if a player is bought with insufficient balance then the player should not be added to the user's team and the balance should not be updated", async () => {
    const player5 = 
    {
        id: 5, 
        name: "Test player5",
        position: "Midfielder",
        number: 10,
        club: "Test Club",
        price: 200000000,
        image: "img5",
    };

    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());

    let error;
    try {
        await teamService.buyPlayer("testUser", 5);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();

    const players = await teamService.getPlayers("testUser");
    expect(players).not.toContainEqual(player5);

    const balance = await teamService.getBalance("testUser");
    expect(balance).toEqual(100000000);
});

test("if a player is sold then the player should be removed from the user's team and the balance should be updated", async () => {
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

    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());
    teamService.buyPlayer("testUser", player1.id);

    const balance_before_sell = await teamService.getBalance("testUser");
    expect(balance_before_sell).toEqual(99999990);

    const player1copy = await teamService.sellPlayer("testUser", player1.id);

    expect(player1copy).toEqual(player1);


    const players = await teamService.getPlayers("testUser");
    expect(players).not.toContainEqual(player1);

    const balance_after_sell = await teamService.getBalance("testUser");
    expect(balance_after_sell).toEqual(100000000);
});

test("if a player that is not in the user's team is sold then the balance should not be updated", async () => {
    const player2 = 
    {
        id: 2, 
        name: "Test player2",
        position: "Attacker",
        number: 9,
        club: "Test Club",
        price: 10,
        image: "img2",
    };

    const authService = new AuthService();
    authService.registerUser("testUser", "testPassword");
    const teamService = new TeamService(authService, new PlayerService());

    const player2copy = await teamService.sellPlayer("testUser", 2);
    expect(player2copy).toBeUndefined();
    
    const balance = await teamService.getBalance("testUser");
    expect(balance).toEqual(100000000);
}); 
