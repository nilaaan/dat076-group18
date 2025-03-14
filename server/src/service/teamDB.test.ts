import { PlayerModel } from "../db/player.db";
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

    const playerService = new PlayerService();

    const pointSystemService = new PointSystemService();

    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);
    
    const teamDBService = new TeamDBService(userDBService, playerService, pointSystemService, gameSessionService);

    gameSessionService.setTeamService(teamDBService);
    gameSessionService.setUserService(userDBService);

    await userDBService.registerUser("username", "username");

    const player = await teamDBService.buyPlayer("username", 4);    

    expect(player).toEqual(player4);
});


test("if all players from a user's team are requested then all players should be returned", async () => {

    const playerService = new PlayerService();

    const pointSystemService = new PointSystemService();

    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);
    
    const teamDBService = new TeamDBService(userDBService, playerService, pointSystemService, gameSessionService);

    gameSessionService.setTeamService(teamDBService);
    gameSessionService.setUserService(userDBService);

    const player = await teamDBService.buyPlayer("username", 1);    

    const team = await teamDBService.getPlayers("username");

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


