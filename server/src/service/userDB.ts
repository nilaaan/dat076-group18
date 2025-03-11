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

    async registerUser(username: string, password: string): Promise<User | null> {

        const user = await this.getUser(username);          // later, when you have separated the db query methods (like getUser) to other classes, 
        if (user) {                                         // just user this.findUser(username) instead 
            console.error(`User ${username} already exists`);
            return null;
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = await UserModel.create({
            username: username,
            password: hashedPassword
        });

        const newTeam = await TeamModel.create({
            user_id: newUser.id,
            balance: 100000000,
            points: 0,
        });

        console.log(`Registered just now User with name ${username}`)
        // Convert the instance to a plain object and return it
        return {
            id: newUser.id,
            username: newUser.username,
            password: newUser.password,
            team: {
                players: [],
                balance: 100000000
            }
        } as User;
    }


    // returns the user with the given username if the user exists and the password is correct if specified
    // returns null if the user does not exist or the password is incorrect

    async findUser(username: string, password?: string): Promise<User | null> {

        const user = await this.getUser(username);

        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        if (password && !await bcrypt.compare(password, user.password)) {
            console.error(`Wrong password`);
            return null;
        }

        if (password) { 
            this.gamesessionService.handleLogin(user.id);
        }

        // Find the team for the user
        const team = await this.getTeam(username);

        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return null;
        }

        // Find the players associated with the user's team
        const teamPlayers = await TeamPlayers.findAll({
            where: { team_id: team.id },
        });

        // Extract the player IDs from the teamPlayers results
        const playerIds = teamPlayers.map(tp =>tp.player_id);

        // Fetch the player details using the player IDs
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

        console.log(`User with name ${username} logged in just now`) 

        return {
            id: user.id,
            username: user.username,
            password: user.password,
            team: {
                players: players,
                balance: team.balance
            }
        } as User;
    }

    // EXTRACT DB QUERIES TO A DB COMMUNICATOR OF SOME SORT
    // returns the team row of the given user in the TeamModel database table 
    // returns null if the user does not exist
    async getTeam(username: string): Promise<TeamModel | null> {
        const user = await this.getUser(username);

        if (!user) {
            console.error(`User ${username} does not exist`);
            return null;
        }

        // Find the team for the user
        const team = await TeamModel.findOne({
            where: { user_id: user.id }
        });

        return team;
    }


    // returns the user row of the given user in the UserModel database table
    // returns null if the user does not exist
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