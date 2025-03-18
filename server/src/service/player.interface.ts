import { Player } from "../model/player.interface";

export interface IPlayerService {

    // returns a copy of a specific player with the given id number
    // returns undefined if there is no player with that id 
    getPlayer(id: number) : Promise<Player | undefined>;

    // returns a deep copy of all existing players
    getPlayers() : Promise<Player[]>;

    
    getPlayerByIds(ids: number[]): Promise<Player[] | undefined>;


    getRoundRating(player_id: number, round: number): Promise<number | null | undefined>


    getRoundAvailability(player_id: number, round: number): Promise<boolean | null | undefined> 


    getRecentForm(player_id: number, round: number): Promise<number | null | undefined>
    

    getTopPerformers(round: number): Promise<Player[] | undefined> 



}