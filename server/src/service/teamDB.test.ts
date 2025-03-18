import { PlayerModel } from "../db/player.db";
import { RatingModel } from "../db/rating.db";
import { GameSessionService } from "./game_session";
import { PlayerService } from "./player";
import { PlayerDBService } from "./playerDB";
import { PointSystemService } from "./pointsystem";
import { TeamDBService } from "./teamDB";
import { UserDBService } from "./userDB";



export const addAllPlayers = async () => {
    const playerService = new PlayerService();
    const players = await playerService.getPlayers();

    // Add all players to the PlayerModel table before running the tests
    for (const player of players) {
        await PlayerModel.create(player);
    }
};

const addAllRatings = async () => {
    const ratings = [
        { player_id: 1, round: 1, rating: null },
        { player_id: 2, round: 1, rating: 7.3 },
        { player_id: 1, round: 2, rating: null },
        { player_id: 2, round: 2, rating: null },
        { player_id: 1, round: 3, rating: 3.1 },
        { player_id: 2, round: 3, rating: 6.2 },
        { player_id: 1, round: 4, rating: 5.7 },
        { player_id: 2, round: 4, rating: null },
        { player_id: 1, round: 5, rating: 7.2 },
        { player_id: 2, round: 5, rating: null },
        { player_id: 1, round: 6, rating: null },
        { player_id: 2, round: 6, rating: null },
        { player_id: 1, round: 7, rating: 7.1 },
        { player_id: 2, round: 7, rating: null },
        { player_id: 1, round: 8, rating: 3.2 },
        { player_id: 2, round: 8, rating: 6.0 },
        { player_id: 1, round: 9, rating: null },
        { player_id: 2, round: 9, rating: 8.0 },
    ];

    for (const rating of ratings) {
        await RatingModel.create(rating); 
    }
};

const initServices = () => {
    const playerService = new PlayerDBService();
    const poitSystemService = new PointSystemService();
    const gameSessionService = new GameSessionService();
    const userService = new UserDBService();
    const teamService = new TeamDBService(userService, playerService, poitSystemService, gameSessionService);
    
    userService.setPlayerService(playerService);
    userService.setTeamService(teamService);
    gameSessionService.setUserService(userService);
    gameSessionService.setTeamService(teamService);

    return { playerService, poitSystemService, gameSessionService, userService, teamService };
};


test("if a player is bought then the player should be added to the user's team and the balance should be updated", async () => {

    await addAllPlayers();

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

    const { userService, teamService } = initServices();

    await userService.registerUser("username", "username");

    const player = await teamService.buyPlayer("username", 4);    

    expect(player).toEqual(player4);

    const players = await teamService.getPlayers("username");
    expect(players).toContainEqual(player4);

    const balance = await teamService.getBalance("username");
    expect(balance).toEqual(100000000 - 5);
});

test("if the user attemps to buy an non-existing player then undefined should be returned", async () => {

    const { teamService } = initServices();

    const player = await teamService.buyPlayer("username", 1000);    

    expect(player).toBeUndefined();
}); 

test("if a non-existing user tries to buy a player then undefined should be returned", async () => {

    const { teamService } = initServices();

    const player = await teamService.buyPlayer("non-existing", 1000);    

    expect(player).toBeUndefined();
}); 


test("if all players from a user's team are requested then all players should be returned", async () => {

    const { userService, teamService } = initServices();

    const player = await teamService.buyPlayer("username", 1);    

    const team = await teamService.getPlayers("username");

    expect(team).toEqual([{
        id: 1,
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        image: "img1",
    },{
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 5,
        image: "img4",
    }]);
}); 


test("if the balance of the user's team is requested then the correct balance should be returned", async () => {
    const { teamService } = initServices();

    const balance = await teamService.getBalance("username");

    expect(balance).toEqual(100000000 - 10 - 5);
});


test("if a player is sold then the player should removed from the user's team and the balance should be updated", async () => {

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

    const { userService, teamService } = initServices();

    const player = await teamService.sellPlayer("username", 4);    

    expect(player).toEqual(player4);

    const players = await teamService.getPlayers("username");
    expect(players).toEqual([{
        id: 1,
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 10,
        image: "img1",
    }]);

    const balance = await teamService.getBalance("username");
    expect(balance).toEqual(100000000 - 10);
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

    const { teamService } = initServices();

    let error;
    try {
        await teamService.buyPlayer("username", 5);
    } catch (e) {
        error = e;
    }
    expect(error).toBeUndefined();

    const players = await teamService.getPlayers("username");
    expect(players).not.toContainEqual(player5);

    const balance = await teamService.getBalance("username");
    expect(balance).toEqual(100000000 - 10);
});


test("if a player that is not in the user's team is sold then the balance should not be updated", async () => {

    const { teamService } = initServices();

    const player2copy = await teamService.sellPlayer("username", 2);
    expect(player2copy).toBeUndefined();
    
    const balance = await teamService.getBalance("username");
    expect(balance).toEqual(100000000 - 10);
}); 


test("team points should be updated correctly", async () => {

    await addAllRatings();

    const { teamService } = initServices();

    await teamService.buyPlayer("username", 2);

    await teamService.updateTeamPoints("username", 3);

    const points = await teamService.getPoints("username");
    expect(points).toEqual(42.63);
}); 

test("if updateTeamPoints() is called on a round out of bounds, undefined should be returned", async () => {

    const { teamService } = initServices();

    const updated = await teamService.updateTeamPoints("username", 40);

    expect(updated).toEqual(undefined);
}); 
