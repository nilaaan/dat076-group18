
export interface IGameSessionService {

    startGameSession(username: string): Promise<boolean | undefined>;

    isGameSession(username: string): Promise<boolean | undefined>;

    isGameSessionFinished(username: string): Promise<boolean | undefined> 

    isMatchesInProgress(username: string): Promise<boolean | undefined> 

    updateState(username: string): Promise<boolean | undefined>

    getRound(username: string): Promise<number | undefined>

    getGameSessionId(username: string): Promise<number | undefined>

    getLeaderboard(username: string) : Promise<[string,  number][] | undefined>;

}