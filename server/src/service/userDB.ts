import { User } from "../model/user.interface";
import bcrypt from "bcrypt";
import { IUserService } from "./user.interface";
import { UserModel } from "../db/user.db";
import { Player } from "../model/player.interface";
import { ITeamService } from "./team.interface";
import { IPlayerService } from "./player.interface";

// Handles the operations that have to do with the users
// Handles the communication with the User database table
export class UserDBService implements IUserService {
      private teamService: ITeamService | null = null;
      private playerService: IPlayerService | null = null;


    setTeamService(teamService: ITeamService) {
        this.teamService = teamService;
    }
    setPlayerService(playerService: IPlayerService) {
        this.playerService = playerService; 
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
        const newTeam = await this.teamService?.createTeam(newUser.id);
        if (!newTeam) {
            console.error(`user id must be a positive integer`);
            return null;
        }

        console.log(`Registered User with name ${username}`)

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
        const team = await this.teamService?.getUserTeam(username);
        if (!team) {
            console.error(`Team for user ${username} does not exist`);
            return null;
        }

        const teamPlayers = await this.teamService?.getTeamPlayers(username)     
        if (!teamPlayers) {
            console.error(`Team players for user ${username} do not exist`);
            return null;
        }

        const playerIds = teamPlayers.map(tp =>tp.player_id);
        const team_players = await this.playerService?.getPlayerByIds(playerIds);
        if (!team_players) {
            console.error(`No players found with the given ids` + playerIds);
            return null;
        }

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


    // Returns the user row of the given user (by id) from the User database table
    // Returns null if the user does not exist
    async getUserById(id: number): Promise<UserModel | null> {
        if (id < 0) {
            console.error(`User id must be a positive integer`);
            return null;
        }
        const user = await UserModel.findOne({
            where: { id: id },
        });

        if (!user) {
            console.error(`User with id ${id} does not exist`);
            return null;
        }

        return user;
    }

}