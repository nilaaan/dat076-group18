import { PlayerService } from './player';
import { Player } from '../model/player.interface';

test("If a player is added to the list then it should be in the list", async () => {
    const id = 1; 
    // Mock player data
    const player: Player = {
        id: id, 
        name: "Test player",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: true,
        points: 0
    };
    const playerService = new PlayerService();

    // Mock the addPlayer method to add the player directly
    playerService.addPlayer = jest.fn().mockImplementation(async () => {
        playerService['players'].push(player);
        return { ...player };
    });

    // Add the player
    await playerService.addPlayer("mockApiUrl");

    // Get the list of players
    const players = await playerService.getPlayers();

    // Check if the player is in the list
    expect(players.some((player) => player.id === id)).toBeTruthy();
});

test("If a specific player is requested then it should be returned", async () => {
    // Mock player data
    const player1: Player = {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: true,
        points: 0
    };
    const player2: Player = {
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 1000000,
        available: true,
        points: 0
    };
    const playerService = new PlayerService();

    // Mock the addPlayer method to add players directly
    playerService.addPlayer = jest.fn().mockImplementation(async (apiUrl: string) => {
        if (apiUrl === "mockApiUrl1") {
            playerService['players'].push(player1);
            return player1;
        } else if (apiUrl === "mockApiUrl2") {
            playerService['players'].push(player2);
            return player2;
        }
        throw new Error("Unknown API URL");
    });

    // Add the players
    await playerService.addPlayer("mockApiUrl1");
    await playerService.addPlayer("mockApiUrl2");

    // Get the specific player
    const player1copy = await playerService.getPlayer(player1.id);
    const player2copy = await playerService.getPlayer(player2.id);

    // Check if the players are returned correctly
    expect(player1copy).toEqual(player1);
    expect(player2copy).toEqual(player2);
});
