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

    // returns the current balance of the user's team 
    async getBalance(username: string): Promise<number | undefined> {
        const user = await this.userService.findUser(username);

        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        return user.team.balance;
    }


    // returns the current balance of the user's team 
    async getPoints(username: string): Promise<number | undefined> {
        const user = await this.userService.findUser(username);

        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined
        }

        return user.team.points;
    }

    // returns all players from the user's team 
    async getPlayers(username: string): Promise<Player[] | undefined> {

        const user = await this.userService.findUser(username);

        if (!user) {
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

    // buys a player to the user's team and updates the user's team balance
    // returns undefined if the player does not exist, the user has insufficient balance, the player is already in the team, the team is full, 
    // or if matches are currently being played (in which case the user should not be able to make changes to the team)
    async buyPlayer(username: string, player_id: number): Promise<Player | undefined> {

        const user = await this.userService.findUser(username);

        if (!user) {
            console.error(`User ${username} does not exist`);       // extract to check conditions, etc. 
            return undefined
        }

        // check if matches are currently being played
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

        // Check if the player is already in the team
        const isPlayerInTeam = user.team.players.find((player) => Number(player.id) === player_id);     // needs to convert to int because database returns attribute as string, fix it 

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
        await team.update({ balance: new_balance });

        return player
    }

    // sells a player from the user's team and updates the user's team balance
    // returns undefined if the player does not exist in the user's team or if matches are currently being played 
    // (in which case the user should not be able to make changes to the team)
    async sellPlayer(username: string, player_id: number): Promise<Player | undefined> {

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


    // for all team players, get their last_ratings, pass it to pointSystem class method, get the team points, and update team points 
    async updateTeamPoints(username: string, round: number): Promise<boolean | undefined> {
        const team = await this.getUserTeam(username);

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return undefined;
        }

        const teamPlayers = await TeamPlayers.findAll({
            where: { team_id: team.id }
        });

        let roundPoints: number = 0;

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

        const updatedPoints = Number(team.points) + roundPoints;
        const teamPoints = parseFloat(updatedPoints.toFixed(2));

        await team.update({ points: teamPoints });

        return true;
    }
    
}



