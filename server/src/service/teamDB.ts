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
import { IPointSystemService } from './pointsystem.interface';
import { ITeamStateService } from './team_state.interface';
import { IGameSessionService } from './game_session.interface';


export class TeamDBService implements ITeamService, ITeamStateService {
    private userService;
    private playerService;
    private pointSystemService;
    private gamesessionService;

    constructor(userService: IUserService, playerService: IPlayerService, pointSystemService: IPointSystemService, gamesessionService: IGameSessionService) {
        this.userService = userService;
        this.playerService = playerService;
        this.pointSystemService = pointSystemService;
        this.gamesessionService = gamesessionService;
    }

    // Returns the current balance of the user's team 
    // Returns undefined if the user does not exist
    async getBalance(username: string): Promise<number | undefined> {
        const user = await this.userService.findUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        return user.team.balance;
    }

    // Returns the current points of the user's team 
    // Returns undefined if the user does not exist
    async getPoints(username: string): Promise<number | undefined> {
        const user = await this.userService.findUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        return user.team.points;
    }

    // Returns all players from the user's team 
    // Returns undefined if the user does not exist
    async getPlayers(username: string): Promise<Player[] | undefined> {
        const user = await this.userService.findUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        const teamPlayers = user.team.players;
        return teamPlayers;
    }

    // Adds a player with the given id into the user's team and updates the user's team balance
    // Returns the player that was bought 
    // Returns undefined if the purchase cannot be made 
    async buyPlayer(username: string, player_id: number): Promise<Player | undefined> {
        if (player_id < 0) {
            throw new Error(`Invalid player id: ${player_id}, id must be a positive integer`);
        }

        const user = await this.userService.findUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);       
            return undefined
        }

        // check if matches are currently being played
        const isMatchesInProgress = await this.gamesessionService.isMatchesInProgress(username);
        if (isMatchesInProgress === undefined) {
            console.error(`Problem finding user ${username} and its game session`);
            return undefined;
        }

        if (isMatchesInProgress) {
            console.error(`Matches are in progress, you cannot make changes to the team right now..`);
            return undefined;
        }

        const player = await this.playerService.getPlayer(player_id);
        if (!player) {
            console.error(`Player not found: ${player_id}`);
            return undefined;
        }

        // check if user has enough balance to buy the player
        if (player.price > user.team.balance) {
            console.error(`Insufficient balance to buy player: ${player_id}`);
            return undefined;
        }

        // check if the player is already in the user's team
        const isPlayerInTeam = user.team.players.find((player) => Number(player.id) === player_id);     // need to convert to int because database returns attribute as string, fix it 

        if (isPlayerInTeam) {
            console.error(`Player already in team: ${player_id}`);
            return undefined;
        }

        // check if the user's team already has 11 or more players
        const playerCount = user.team.players.length;

        if (playerCount >= 11) {
            console.error(`Team is full`);
            return undefined;
        }

        const team = await this.getUserTeam(username);
        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }
        // add the player to the teamplayers database table 
        await TeamPlayers.create({
            team_id: team.id,
            player_id: player_id
        });

        const new_balance = Number(team.balance) - Number(player.price);
        // update the team's balance in the team database table
        await team.update({ balance: new_balance });

        return player
    }

    // Removes a player with the given id from the user's team and updates the user's team balance
    // Returns the player that was sold
    // Returns undefined if the sell cannot be made 
    async sellPlayer(username: string, player_id: number): Promise<Player | undefined> {
        if (player_id < 0) {
            throw new Error(`Invalid player id: ${player_id}, id must be a positive integer`);
        }

        const user = await this.userService.findUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        // check if matches are currently being played
        const isMatchesInProgress = await this.gamesessionService.isMatchesInProgress(username);
        if (isMatchesInProgress === undefined) {
            console.error(`Problem finding user ${username} and its game session`);
            return undefined;
        }

        if (isMatchesInProgress) {
            console.error(`Matches are in progress, you cannot make changes to the team right now..`);
            return undefined;
        }

        // check if the player is in the user's team
        const player = user.team.players.find((player) => Number(player.id) === player_id);
        if (!player) {
            console.error(`Player not found: ${player_id}`);
            return undefined;
        }

        const team = await this.getUserTeam(username);
        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        // remove the player from the teamPlayers database table
        await TeamPlayers.destroy({
            where: { team_id: team.id, player_id: player_id }
        });

        const new_balance = Number(team.balance) + Number(player.price);

        // update the team's balance in the team database table
        await team.update({ balance: new_balance });

        return player;
    }



    // Returns the user's team row from the team database table
    // Returns null if the user does not exist
    async getUserTeam(username: string): Promise<TeamModel | null> {
        const user = await UserModel.findOne({
            where: { username: username }
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


    // Updates the user's team points for the given round 
    // Returns true if the points were updated successfully
    // Returns undefined the points could not be updated 
    async updateTeamPoints(username: string, round: number): Promise<boolean | undefined> {
        if (round < 1 || round > 38) {
            console.error(`Invalid round number: ${round}, round must be between 1 and 38`);
            return undefined;
        }

        const team = await this.getUserTeam(username);
        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        // get all players of the user's team 
        const teamPlayers = await TeamPlayers.findAll({
            where: { team_id: team.id }
        });

        let roundPoints: number = 0;
        
        // for each player, get their round rating, convert it to points and add it to the total team points for this round 
        for (const teamPlayer of teamPlayers) {
            const player_round_rating = await this.playerService.getRoundRating(teamPlayer.player_id, round);
            if (player_round_rating === undefined) {
                console.error(`Could not get last match rating for player ${teamPlayer.player_id}`);
                return undefined;
            }
            const playerPoints = await this.pointSystemService.calculatePoints(player_round_rating);     // converts rating (1-10) into points 0-70

            if (playerPoints === undefined) {
                console.error(`Could not calculate points for player ${teamPlayer.player_id}`);
                return undefined;
            } else {
                roundPoints += playerPoints;
            }
        }

        // update the  team points in the team database table
        const updatedPoints = Number(team.points) + roundPoints;
        const teamPoints = parseFloat(updatedPoints.toFixed(2));
        await team.update({ points: teamPoints });

        return true;
    }
    
}



