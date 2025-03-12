
export interface IGameSessionService {

    startGameSession(username: string): Promise<boolean|undefined>;

    isGameSession(user_id: number): Promise<boolean>;

    isGameSessionFinished(user_id: number): Promise<boolean | undefined> 

    isMatchesInProgress(user_id: number): Promise<boolean | undefined> 

    updateState(user_id: number): Promise<boolean | undefined>

    getUserRound(user_id: number): Promise<number | undefined>
}