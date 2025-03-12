import { Player } from "../model/player.interface";


export interface ITeamService {

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

    // returns the current points of the user's team
    getPoints(username: string) : Promise<number | undefined>;
    
}