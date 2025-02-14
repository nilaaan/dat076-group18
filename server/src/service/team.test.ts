import { TeamService } from './team';
import { Player } from '../model/player.interface';
import { PlayerService } from './player';
import e from 'express';

test("if all players from the user's team are requested then all players should be returned", async () => {
    const player1 = {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: false,
        points: 0
    };
    const player3 = {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 500000,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const players = await teamService.getPlayers();
    expect(players).toEqual([player1, player3]);
});

test("if a specific player from the user's team is requested then that player should be returned", async () => {
    const player3 = {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 500000,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const player3copy = await teamService.getPlayer(player3.id);
    expect(player3copy).toEqual(player3);
});

test("if the balance of the user's team is requested then the correct balance should be returned", async () => {
    const teamService = new TeamService(new PlayerService());

    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
});

test("if a player is bought then the player should be added to the user's team and marked unavailable, and the balance should be updated", async () => {
    const player4 = {
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 500000,
        available: true,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const player2copy = await teamService.buyPlayer(player4.id);

    player4.available = false; 
    expect(player2copy).toEqual(player4);

    const players = await teamService.getPlayers();
    expect(players).toContainEqual(player4);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(99500000);
});

test("if a player that is unavailable is bought then the player should not be added to the user's team and the balance should not be updated", async () => {
    const player2 = {
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 1000000,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const player2copy = await teamService.buyPlayer(player2.id);
    expect(player2copy).toBeUndefined();

    const players = await teamService.getPlayers();
    expect(players).not.toContainEqual(player2);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
});

test("if a player is bought twice then the player should not be added to the user's team and the balance should not be updated", async () => {
    const player = {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: true,    // player is available by mistake 
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const playercopy = await teamService.buyPlayer(player.id);
    expect(playercopy).toBeUndefined();

    const players = await teamService.getPlayers();
    const player1 = {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: false,
        points: 0
    };
    const player3 = {
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 500000,
        available: false,
        points: 0
    };
    expect(players).toEqual([player1, player3]);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
});

test("if a player is bought with insufficient balance then the player should not be added to the user's team and the balance should not be updated", async () => {
    const player5 = {
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

    const player2copy = await teamService.buyPlayer(player5.id);
    expect(player2copy).toBeUndefined();

    const players = await teamService.getPlayers();
    expect(players).not.toContainEqual(player5);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);
});

test("if a player is sold then the player should be removed from the user's team, marked available, and the balance should be updated", async () => {
    const player1 = {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: false,
        points: 0
    };

    const teamService = new TeamService(new PlayerService());

    const player1copy = await teamService.sellPlayer(player1.id);

    if (player1copy) {
        expect(player1copy.available).toEqual(true);
    }
    
    const players = await teamService.getPlayers();
    expect(players).not.toContainEqual(player1);

    const balance = await teamService.getBalance();
    expect(balance).toEqual(101000000);

    player1.available = true;
    expect(player1copy).toEqual(player1);
});

test("if a player that is not in the user's team is sold then the balance should not be updated and the player state remain unchanged", async () => {
    const player2 = {
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 1000000,
        available: true,
        points: 0
    };

    const player2duplicate = { ... player2 };

    const teamService = new TeamService(new PlayerService());

    const player2copy = await teamService.sellPlayer(player2.id);
    expect(player2copy).toBeUndefined();
    
    const balance = await teamService.getBalance();
    expect(balance).toEqual(100000000);

    expect(player2).toEqual(player2duplicate);
}); 
