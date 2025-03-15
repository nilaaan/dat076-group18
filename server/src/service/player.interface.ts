import { Player } from "../model/player.interface";

export interface IPlayerService {

    // returns a copy of a specific player with the given id number
    // returns undefined if there is no player with that id 
    getPlayer(id: number) : Promise<Player | undefined>;

    // returns a deep copy of all existing players
    getPlayers() : Promise<Player[]>;


    getLastMatchRating(player_id: number, username: string): Promise<number | null | undefined>


    getNextMatchAvailability(player_id: number, username: string): Promise<boolean | null | undefined> 


    getRecentForm(player_id: number, username: string): Promise<number | null | undefined>

}