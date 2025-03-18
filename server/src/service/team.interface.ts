import { TeamModel } from "../db/team.db";
import { TeamPlayers } from "../db/teamPlayers.db";
import { Player } from "../model/player.interface";


export interface ITeamService {

    
    // Creates a new team for the user with the given username in the Team database table
    createTeam(user_id: number): Promise<TeamModel | undefined>

    // Returns all players from the user's team as a list of Player objects
    getPlayers(username: string) : Promise <Player[] | undefined>;

    // Returns all players from the user's team from the TeamPlayers database table
    // Returns undefined if the user does not exist
    getTeamPlayers(username: string): Promise<TeamPlayers[] | undefined>

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

    // Returns the user's team row from the team database table
    // Returns null if the user does not exist
    getUserTeam(username: string): Promise<TeamModel | null>
    
}