import { Player } from "../model/player.interface";


export interface ITeamService {

    // returns a specific player from the user's team
    // returns undefined if no player with that id number exists in the user's team
    getPlayer(username: string, id : number) : Promise<Player | undefined>;

    // returns all players from the user's team 
    getPlayers(username: string) : Promise <Player[] | undefined>;

    // returns the current balance of the user's team 
    getBalance(username: string) : Promise<number | undefined>;

    // adds a player to the user's team if the purchase is successful 
    // and returns a copy of the player bought
    // returns undefined otherwise 
    buyPlayer(username: string, id: number) : Promise<Player | undefined>;

    // adds a player to the user's team if the sell is successful
    // and returns a copy of the player sold
    // returns undefined otherwise
    sellPlayer(username: string, id: number) : Promise<Player | undefined>;    
    
}