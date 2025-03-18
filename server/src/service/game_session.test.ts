
import { GameSessionService } from "./game_session";
import { UserDBService } from "./userDB"; 
import { PlayerDBService } from "./playerDB";
import { PointSystemService } from "./pointsystem";
import { TeamDBService } from "./teamDB";



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


test("isGameSession() on a non-existing user should return undefined", async () => {

    const { gameSessionService } = initServices();
    
    // is game session
    const isGameUser1before = await gameSessionService.isGameSession("user1");
    expect(isGameUser1before).toBe(undefined);


}); 



test("isGameSession() before user starts a gamesession should be false", async () => {

    const { gameSessionService, userService } = initServices();

    await userService.registerUser("user1", "user1");
    
    // is game session
    const isGameUser1before = await gameSessionService.isGameSession("user1");
    expect(isGameUser1before).toBe(false);


}); 


test("starting a gamesession with an existing user should return true", async () => {

    const { gameSessionService } = initServices();

    const started = await gameSessionService.startGameSession("user1");

    expect(started).toBe(true);

}); 


test("isGameSession() after user starts gamesession should be true", async () => {

    const { gameSessionService } = initServices();

    const isGameUser1after = await gameSessionService.isGameSession("user1");
    expect(isGameUser1after).toBe(true);

}); 


test("starting a gamesession with an non-existent user should return undefined", async () => {

    const { gameSessionService } = initServices();

    const started = await gameSessionService.startGameSession("non_existing");

    expect(started).toBe(undefined);

}); 


test("two users should share same gamesession if the second starts/joins a game session before the first user's gamesession is finished ", async () => {
    
    const { gameSessionService, userService } = initServices();

    await userService.registerUser("user2", "user2");
    await userService.registerUser("user3", "user3");


    // expect user 2 and 3 to not have gamessession 
    const isGameUser2before = await gameSessionService.isGameSession("user2");
    expect(isGameUser2before).toBe(false);
    const isGameUser3before = await gameSessionService.isGameSession("user2");
    expect(isGameUser3before).toBe(false);

    // start game for user 2 and 3
    await gameSessionService.startGameSession("user2");
    await gameSessionService.startGameSession("user3");

    // expect user 2 and 3 to have gamessession
    const isGameUser2after = await gameSessionService.isGameSession("user2");
    expect(isGameUser2after).toBe(true);
    const isGameUser3after = await gameSessionService.isGameSession("user3");
    expect(isGameUser3after).toBe(true);

    // expect user 2 and 3 to share the same game session 
    const gameSessionIDUser2 = await gameSessionService.getGameSessionId("user2");
    const gameSessionIDUser3 = await gameSessionService.getGameSessionId("user3");

    expect(gameSessionIDUser2).toBe(gameSessionIDUser3);
}); 


test("getRound() should return the current round of the user's gamesession", async () => {

    const { gameSessionService, userService } = initServices();

    const currentRound = await gameSessionService.getRound("user1");
    expect(currentRound).toBe(1);

}); 



test("getRound() on an non-existent user should return undefined", async () => {

    const { gameSessionService, userService } = initServices();

    const currentRound = await gameSessionService.getRound("non_existing");
    expect(currentRound).toBe(undefined); 
}); 


test("getLeaderboard() should return a list of all gamesession usernames and points belonging to the gamesession of the current logged in user", async () => {

    const { gameSessionService, userService } = initServices();

    const leaderboard = await gameSessionService.getLeaderboard("user1");
    expect(leaderboard).toEqual([["user1", 0], ["user2", 0], ["user3", 0]]);
}); 


test("getLeaderboard() on a non-existing user should return undefined", async () => {

    const { gameSessionService, userService } = initServices();

    const leaderboard = await gameSessionService.getLeaderboard("non_existing");
    expect(leaderboard).toBe(undefined);
}); 







