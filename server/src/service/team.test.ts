import { TeamService } from './team';
import { Player } from '../model/player.interface';
import { PlayerService } from './player';
import e from 'express';

test("if all players from the user's team are requested then all players should be returned", async () => {
    const player1 = 
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        available: false,
        points: 0
    };
    const player3 = 
    {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 5,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());
    const player1copy = await teamService.buyPlayer(1);  
    const player3copy = await teamService.buyPlayer(3); 
    const players = await teamService.getPlayers();
    expect(players).toEqual([player1, player3]);
});

test("if a specific player from the user's team is requested then that player should be returned", async () => {
    const player3 = 
    {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 5,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());
    await teamService.buyPlayer(3);

    const player3copy = await teamService.getPlayer(3);
    expect(player3copy).toEqual(player3);
});

test("if the balance of the user's team is requested then the correct balance should be returned", async () => {
    const teamService = new TeamService(new PlayerService());

    const balance = await teamService.getBalance();
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
        available: true,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const player2copy = await teamService.buyPlayer(4);    

    player4.available = false; 
    expect(player2copy).toEqual(player4);

    const players = await teamService.getPlayers();
    expect(players).toContainEqual(player4);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(99999995);
});

test("if a player that is unavailable is bought then the player should not be added to the user's team and the balance should not be updated", async () => {
    const player2 =         // player 2 in playerService's list of players is unavailable (i.e. some other user has already bought it)
    {
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 10,
        available: false,
        points: 0
    };
    
    const teamService = new TeamService(new PlayerService());
    let error;
    try {
        await teamService.buyPlayer(2);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();

    const players = await teamService.getPlayers();
    expect(players).not.toContainEqual(player2);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
});

test("if a player is bought twice then the player should not be re-added to the user's team and the balance should not be updated", async () => {
    const teamService = new TeamService(new PlayerService());

    await teamService.buyPlayer(1); 
    await teamService.buyPlayer(3);
    await teamService.buyPlayer(4);

    let error;
    try {
        await teamService.buyPlayer(4);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();

    const players = await teamService.getPlayers();
    const player1 = 
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        available: false,
        points: 0
    };
    const player3 = 
    {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 5,
        available: false,
        points: 0
    };
    const player4 =
    {
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 5,
        available: false,
        points: 0
    }
    expect(players).toEqual([player1, player3, player4]);

    const balance = await teamService.getBalance();
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
        available: true,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    let error;
    try {
        await teamService.buyPlayer(5);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();

    const players = await teamService.getPlayers();
    expect(players).not.toContainEqual(player5);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
});

test("if a player is sold then the player should be removed from the user's team, marked available, and the balance should be updated", async () => {
    const player1 = 
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        available: true,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());
    teamService.buyPlayer(player1.id);

    const balance_before_sell = await teamService.getBalance();
    expect(balance_before_sell).toEqual(99999990);

    const player1copy = await teamService.sellPlayer(player1.id);

    expect(player1copy).toEqual(player1);

    if (player1copy) {
        expect(player1copy.available).toEqual(true);
    }
    
    const players = await teamService.getPlayers();
    expect(players).not.toContainEqual(player1);

    const balance_after_sell = await teamService.getBalance();
    expect(balance_after_sell).toEqual(100000000);
});

test("if a player that is not in the user's team is sold then the balance should not be updated", async () => {
    const player2 = 
    {
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 10,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const player2copy = await teamService.sellPlayer(2);
    expect(player2copy).toBeUndefined();
    
    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
}); 
