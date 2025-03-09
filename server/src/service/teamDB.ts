import { Team } from '../model/team.interface';  
import { Player } from '../model/player.interface'; 
import { IPlayerService } from './player.interface';
import { AuthService } from './auth';
import { User } from '../model/user.interface';
import { IUserService } from './user.interface';
import { ITeamService } from './team.interface';
import { UserModel } from '../db/user.db';
import { TeamModel } from '../db/team.db';
import { TeamPlayers } from '../db/teamPlayers.db';
import { PlayerModel } from '../db/player.db';
import { TEXT } from 'sequelize';


export class TeamDBService implements ITeamService {
    private userService;  
    private playerService;

    constructor(userService: IUserService, playerService: IPlayerService) {
        this.userService = userService;
        this.playerService = playerService;
    }

    // returns the current balance of the user's team 
    async getBalance(username: string) : Promise<number | undefined> {
        const user = await this.userService.findUser(username);

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        return user.team.balance;
    }

    // returns a specific player from the user's team
    // returns undefined if no player with that id number exists in the user's team // possibly redundant method might be removed 
    async getPlayer(username: string, id : number) : Promise<Player | undefined> {
        const user = await this.userService.findUser(username);

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        return user.team.players.find((player) => player.id === id);
    }

    // returns a specific player by reference
    // returns undefined if no player with that id number exists
    async getPlayerObject(username: string, id: number) : Promise<Player | undefined> {
        const user : User | null = await this.userService.findUser(username);
        if (! user) {
            return undefined
        }
        return user.team.players.find((player) => player.id === id);
    }

    // returns all players from the user's team 
    async getPlayers(username: string) : Promise <Player[] | undefined> {

        const user = await this.userService.findUser(username);

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }
  
        // get the user's team players 
        const teamPlayers = user.team.players;
        // CHECK IF ANY CURRENT PLAYERS ARE NOT PLAYING NEXT MATCH OR CREATE SEPARATE GET REQUEST 
        /*players.forEach(async player => {
            if (player.rating === null) {}}); 
        // Notify users that player is not playing next match but still return all players*/

        // Convert the player instances to plain JavaScript objects and then to Player objects

        return teamPlayers; 
    }
    
    // buys a player to the user's team, marking the player as unavailable to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist or if the user has insufficient balance
    async buyPlayer(username: string, player_id: number) : Promise <Player | undefined> {

        const user = await this.userService.findUser(username);

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        const player = await this.playerService.getPlayer(player_id);

        if (!player) {
            console.error(`Player not found: ${player_id}`);
            return undefined;
        }

        if (player.price > user.team.balance) {
            console.error(`Insufficient balance to buy player: ${player_id}`); 
            return undefined;
        }

        // Check if the player is already in the team
        const isPlayerInTeam = user.team.players.find((player) => player.id === player_id);

        if (isPlayerInTeam) {
            console.error(`Player already in team: ${player_id}`);
            return undefined;
        }

        // Check if the team already has 11 or more players
        const playerCount = user.team.players.length;

        if (playerCount >= 11) {
            console.error(`Team is full`);
            return undefined;
        }

        // CHECK IF THE PLAYER WILL EVEN PLAY NEXT MATCH (IF RATING IS AVAILABLE FOR NEXT MATCH
       /* if (player.rating === null) {
            console.error(`Player is not playing next match`);
            return undefined;
        }*/
        const team = await this.getUserTeam(username);

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }
        // Add the player to the teamPlayers table
        await TeamPlayers.create({
            team_id: team.id,
            player_id: player_id
        });
        
        const new_balance = Number(team.balance) - Number(player.price);

        // Update the team's balance
        await team.update({ balance: new_balance});

        return player
    }

    // sells a player from the user's team, marking the player as available to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist in the user's team
    async sellPlayer(username: string, player_id : number) : Promise <Player | undefined> {

        const user = await this.userService.findUser(username);

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        const isPlayerInTeam = user.team.players.find((player) => player.id === player_id);

        if (! isPlayerInTeam) {
            console.error(`Player not found in team: ${player_id}`);
            return undefined;
        }
        
        const player = await this.playerService.getPlayer(player_id);

        if (!player) {
            console.error(`Player not found: ${player_id}`);
            return undefined;
        }

        const team = await this.getUserTeam(username);

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        // Remove the player from the teamPlayers table
        await TeamPlayers.destroy({
            where: { team_id: team.id, player_id: player_id }
        });

        const new_balance = Number(team.balance) + Number(player.price);

        // Update the team's balance
        await team.update({ balance: new_balance });
 
        return player;
    }

    // add methods with common code. Perhaps a query handler too that takes care of communication with the database



    // change this method to some other place, does not belong in this class
    async getUserTeam(username: string): Promise<TeamModel | null> {
        const user = await UserModel.findOne({
            where: { username: username },
        });

        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        return team;
    }



    // update points ()
    // for all team players, get their last_ratings, pass it to pointSystem class method, get the team points, and update team points 
}

    
