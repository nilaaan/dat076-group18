export interface IPlayerStateService {
    
    // updates the stats of all players in the database
    updatePlayerStats(round: number): Promise<boolean | undefined>;
}