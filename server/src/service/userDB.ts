import { User } from "../model/user.interface";
import bcrypt from "bcrypt";
import { IUserService } from "./user.interface";
import { UserModel } from "../db/user.db";
import { TeamModel } from "../db/team.db";
import { TeamPlayers } from "../db/teamPlayers.db";
import { PlayerModel } from "../db/player.db";
import { get } from "http";
import { Player } from "../model/player.interface";
import { IGameSessionService } from "./game_session.interface";

export class UserDBService implements IUserService {
    private gamesessionService; 

    constructor(gamesessionService: IGameSessionService) {
        this.gamesessionService = gamesessionService;
    }

    // Registers a user with the given username and password 
    // Returns the user if the registration was successful
    // Returns null if the user already exists
    async registerUser(username: string, password: string): Promise<User | null> {
        
        // check if the username is already taken 
        const user = await this.getUser(username);          
        if (user) {                                         
            console.error(`User ${username} already exists`);
            return null;
        }

        // create password hash
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // add the user to the User database table
        const newUser = await UserModel.create({
            username: username,
            password: hashedPassword
        });

        // create a new team for the user and add it to the Team database table
        const newTeam = await TeamModel.create({
            user_id: newUser.id,
            balance: 100000000,
            points: 0,
        });

        console.log(`Registered just now User with name ${username}`)

        return {
            id: newUser.id,
            username: newUser.username,
            password: newUser.password,
            team: {
                players: [],
                balance: 100000000,
                points: 0
            }
        } as User;
    }


    // Looks for the user with the given username and password 
    // Returns the user with the given username if the user exists and the password is correct if specified
    // Returns null if the user does not exist or the password is incorrect
    async findUser(username: string, password?: string): Promise<User | null> {

        // check if user exists 
        const user = await this.getUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        // check if the password is correct
        if (password && !await bcrypt.compare(password, user.password)) {
            console.error(`Wrong password`);
            return null;
        }
        console.log(`User with name ${username} just logged in`) 

        // extract the user's team information
        const team = await this.getTeam(username);
        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return null;
        }

        const teamPlayers = await TeamPlayers.findAll({
            where: { team_id: team.id },
        });

        const playerIds = teamPlayers.map(tp =>tp.player_id);
        const team_players = await PlayerModel.findAll({
            where: { id: playerIds }
        }); 

        let players: Player[] = [];
        
        if (team_players.length > 0) {
            players = team_players.map(player => ({
                id: player.id,
                name: player.name,
                position: player.position,
                number: player.number,
                club: player.club,
                price: player.price,
                image: player.image
            }));
        } 

        // add the team information to the user object and return the user 
        return {
            id: user.id,
            username: user.username,
            password: user.password,
            team: {
                players: players,
                balance: team.balance,
                points: team.points
            }
        } as User;
    }

    // Updates the user's gamesession state
    // Returns true if the state was successfully updated
    // Returns null if the state could not be updated
    async updateGamesessionState(username: string): Promise<boolean | null>  { 
        const is_game_session_updated = await this.gamesessionService.updateState(username);
        if (!is_game_session_updated) {
            console.error(`Failed to update game session state for user ${username}`);
            return null;
        }
        return is_game_session_updated; 
    }

 
    // Returns the team row of the given user from the Team database table 
    // Returns null if the user does not exist
    async getTeam(username: string): Promise<TeamModel | null> {
        const user = await this.getUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        // find the team for the user
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        return team;
    }


    // Returns the user row of the given user from the User database table
    // Returns null if the user does not exist
    async getUser(username: string): Promise<UserModel | null> {
        const user = await UserModel.findOne({
            where: { username: username },
        });

        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        return user;
    }

}