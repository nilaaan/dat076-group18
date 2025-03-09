import { PlayerService } from './player';
import { Player } from '../model/player.interface';

test("If all players are requested then all players should be returned", async () => {
    const player1 =   
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        image: "img1",
    };
    const player2 = 
    {
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 10,
        image: "img2",
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
    };
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
    const playerService = new PlayerService(); 
    const players = await playerService.getPlayers();
    expect(players).toEqual([player1, player2, player3, player4, player5]);
});

test("If a specific player is requested then it should be returned", async () => {

    const player1 = 
    {
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        image: "img1",
    }; 
    const playerService = new PlayerService();

    const player1copy = await playerService.getPlayer(player1.id);
    expect(player1copy).toEqual(player1);
});

test("If a player that does not exist is requested then undefined should be returned", async () => {
    
    const playerService = new PlayerService();

    let error;
    try {
        await playerService.getPlayer(1006);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();
});
