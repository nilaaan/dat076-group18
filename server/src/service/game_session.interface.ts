
export interface IGameSessionService {

    startGameSession(user_id: number): Promise<boolean>;

    isGameSession(user_id: number): Promise<boolean>;

    isGameSessionFinished(user_id: number): Promise<boolean | undefined> 

    isMatchesInProgress(user_id: number): Promise<boolean | undefined> 

    updateState(user_id: number): Promise<boolean | undefined>

}