import { start } from "repl";
import { GameSessionService } from "./game_session";
import { UserDBService } from "./userDB"; 


test("isGame before startGame", async () => {

    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);

    gameSessionService.setUserService(userDBService);

    await userDBService.registerUser("user1", "user1");
    
    // is game session
    const isGameUser1before = await gameSessionService.isGameSession("user1");
    expect(isGameUser1before).toBe(false);


}); 


test("isGame after startGame", async () => {
    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);

    gameSessionService.setUserService(userDBService);

    await gameSessionService.startGameSession("user1");

    const isGameUser1after = await gameSessionService.isGameSession("user1");
    expect(isGameUser1after).toBe(true);

}); 


test("two users share same gamesession", async () => {
    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);

    gameSessionService.setUserService(userDBService);

    await userDBService.registerUser("user2", "user2");
    await userDBService.registerUser("user3", "user3");

    // user 1 still has game 
    const isGameUser1after = await gameSessionService.isGameSession("user1");
    expect(isGameUser1after).toBe(true);

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


test("get current round", async () => {
    const gameSessionService = new GameSessionService();
    
    const userDBService = new UserDBService(gameSessionService);

    gameSessionService.setUserService(userDBService);

    const currentRound = await gameSessionService.getRound("user1");
    expect(currentRound).toBe(1);
    console.log("current round: " + currentRound);

}); 


