import { Team } from '../model/team.interface';  
import { Player } from '../model/player.interface'; 
import { PlayerService } from './player'; 
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

    constructor(userService: IUserService) {
        this.userService = userService;
    }

    // returns the current balance of the user's team 
    async getBalance(username: string) : Promise<number | undefined> {
        const user = await UserModel.findOne({
            where: { username: username }
        }); 

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        // Find the team for the user using user.id
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        return team.balance;
        
    }

    // returns a specific player from the user's team
    // returns undefined if no player with that id number exists in the user's team
    async getPlayer(username: string, id : number) : Promise<Player | undefined> {
        const user = await UserModel.findOne({
            where: { username: username }
        }); 

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        // Find the team for the user using user.id
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        // Find the if the player in the teamPlayers table
        const isPlayerinTeam = await TeamPlayers.findOne({
            where: { team_id: team.id, player_id: id }
        });

        if (!isPlayerinTeam) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        // Fetch the player details using the player IDs
        const player = await PlayerModel.findOne({
            where: { id: id },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        // Convert the player instance to a plain JavaScript object
        if (!player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        return player.get({ plain: true }) as Player;
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

        const user = await UserModel.findOne({
            where: { username: username }
        }); 

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        // Find the team for the user using user.id
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }
    
        // get the user's team players 
        const teamPlayers = await TeamPlayers.findAll({
            where: { team_id: team.id }
        });

        // Extract the player IDs from the teamPlayers results
        const playerIds = teamPlayers.map(tp => tp.player_id);

        if (playerIds.length === 0) {
            console.log(`No players found for team ${team.id}`);
            return [];
        }

        // Fetch the player details using the player IDs
        const players = await PlayerModel.findAll({
            where: { id: playerIds },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

            // Convert the player instances to plain JavaScript objects and then to Player objects
        const playerList: Player[] = players.map(playerInstance => {
        const plainPlayer = playerInstance.get({ plain: true });
        return {
            id: plainPlayer.id,
            name: plainPlayer.name,
            position: plainPlayer.position,
            number: plainPlayer.number,
            club: plainPlayer.club,
            price: plainPlayer.price,
            available: plainPlayer.available,
            points: plainPlayer.points
            };
        });
    
        return playerList;
    }
    
    // buys a player to the user's team, marking the player as unavailable to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist or if the user has insufficient balance
    async buyPlayer(username: string, id: number) : Promise <Player | undefined> {

        const user = await UserModel.findOne({
            where: { username: username }
        }); 

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        // Find the team for the user using user.id
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });
        
        if (! team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        const player = await PlayerModel.findOne({
            where: { id: id }
        })

        if (!player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        
        if (!player.available) {
            console.error(`Player not available: ${id}`);
            return undefined;
        }

        if (player.price > team.balance) {
            console.error(`Insufficient balance to buy player: ${id}`); 
            return undefined;
        }

        // Check if the player is already in the team
        const isPlayerInTeam = await TeamPlayers.findOne({
            where: { team_id: team.id, player_id: id }
        });

        if (isPlayerInTeam) {
            console.error(`Player already in team: ${id}`);
            return undefined;
        }

        // Check if the team already has 11 or more players
        const playerCount = await TeamPlayers.count({
            where: { team_id: team.id }
        });

        if (playerCount >= 11) {
            console.error(`Team is full`);
            return undefined;
        }

        // Update the player's availability in the PlayerModel table
        await PlayerModel.update({ available: false }, {
            where: { id: player.id }
        });

        // Add the player to the teamPlayers table
        await TeamPlayers.create({
            team_id: team.id,
            player_id: id
        });
        
        const new_balance = Number(team.balance) - Number(player.price);

        // Update the team's balance
        await team.update({ balance: new_balance});
        
        const player_after = await PlayerModel.findOne({
            where: { id: id },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (!player_after) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
 
        return player_after.get({ plain: true }) as Player;
        }

    // sells a player from the user's team, marking the player as available to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist in the user's team
    async sellPlayer(username: string, id : number) : Promise <Player | undefined> {

        const user = await UserModel.findOne({
            where: { username: username }
        }); 

        if (! user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        // Find the team for the user using user.id
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });
        
        if (! team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        const isPlayerInTeam = await TeamPlayers.findOne({
            where: { team_id: team.id, player_id: id }
        });

        if (! isPlayerInTeam) {
            console.error(`Player not found in team: ${id}`);
            return undefined;
        }
        
        const player = await PlayerModel.findOne({
            where: { id: id }
        });

        if (!player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        // Update the player's availability in the PlayerModel table
        await PlayerModel.update({ available: true }, {
            where: { id: player.id }
        });

        // Remove the player from the teamPlayers table
        await TeamPlayers.destroy({
            where: { team_id: team.id, player_id: id }
        });

        const new_balance = Number(team.balance) + Number(player.price);

        // Update the team's balance
        await team.update({ balance: new_balance });

        const player_after = await PlayerModel.findOne({
            where: { id: id },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (!player_after) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
 
        return player_after.get({ plain: true }) as Player;
    }

    private increaseBalance(user: User, amount: number) {
        user.team.balance += amount; 
    }

    private decreaseBalance(user: User, amount: number) {
        user.team.balance -= amount; 
    }

    private addPlayer(user: User, player: Player) {
        user.team.players.push(player);
    }
    
    private removePlayer(user: User, id: number) {
        const indexToRemove = user.team.players.findIndex((player) => player.id === id);
        if (indexToRemove !== -1) {
            user.team.players.splice(indexToRemove, 1);
        }
    }

    private markPlayerAvailable(player: Player) {
        player.available = true; 
    }

    private markPlayerUnavailable(player: Player) {
        player.available = false; 
    }
}