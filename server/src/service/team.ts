import { Player } from '../model/player.interface';
import { PlayerService } from './player';
import { User } from '../model/user.interface';
import { IUserService } from './user.interface';
import { ITeamService } from './team.interface';
import { TeamModel } from '../db/team.db';
import { TeamPlayers } from '../db/teamPlayers.db';

// Takes care of all operations related to the user's team and its state 
export class TeamService implements ITeamService {
    private userService;
    private playerService;

    constructor(userService: IUserService, playerService: PlayerService) {
        this.userService = userService;
        this.playerService = playerService;
    }


    // returns the current balance of the user's team 
    async getBalance(username: string): Promise<number | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return user.team.balance;
    }

    // returns the current balance of the user's team 
    async getPoints(username: string): Promise<number | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return user.team.points;
    }


    // returns a specific player by reference
    // returns undefined if no player with that id number exists
    async getPlayerObject(username: string, id: number): Promise<Player | undefined> {
        if (id < 0) {
            console.error('Invalid id, must be positive integer');
            return undefined;
        }

        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return user.team.players.find((player) => player.id === id);
    }

    // returns all players from the user's team 
    async getPlayers(username: string): Promise<Player[] | undefined> {
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        return JSON.parse(JSON.stringify(user.team.players));
    }

    // buys a player to the user's team and updates the user's balance
    // returns the player bought if the purchase was successful
    // returns undefined otherwise
    async buyPlayer(username: string, id: number): Promise<Player | undefined> {
        if (id < 0) {
            console.error('Invalid id, must be positive integer');
            return undefined;
        }
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        const player = this.playerService.getPlayerObject(id);
        if (!player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        if (player.price > user.team.balance) {
            console.error(`Insufficient balance to buy player: ${id}`);
            return undefined;
        }

        if (user.team.players.find((player) => player.id === id)) {
            console.error(`Player already in team: ${id}`);
            return undefined;
        }

        if (user.team.players.length >= 11) {
            console.error(`Team is full`);
            return undefined;
        }
        this.addPlayer(user, player);
        this.decreaseBalance(user, player.price);
        return { ...player };
    }

    // sells a player from the user's team and updates the user's balance
    // returns the player sold if the sell was successful
    // returns undefined otherwise
    async sellPlayer(username: string, id: number): Promise<Player | undefined> {
        if (id < 0) {
            console.error('Invalid id, must be positive integer');
            return undefined;
        }
        const user: User | null = await this.userService.findUser(username);
        if (!user) {
            return undefined
        }
        const player = await this.getPlayerObject(username, id);
        if (!player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        if (this.checkForTeamSize(user)) {        
        this.removePlayer(user, player.id);
        this.increaseBalance(user, player.price);
        }
        else{
            console.error(`Team is full`);
            return undefined;
        }

        return { ...player };
    }


    private increaseBalance(user: User, amount: number) {
        user.team.balance += amount;
    }

    private decreaseBalance(user: User, amount: number) {
        user.team.balance -= amount;
    }

    private checkForTeamSize(user: User): boolean {
        return user.team.players.length < 11;
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

    
    createTeam(user_id: number): Promise<TeamModel | undefined> {
        // not used before creating teamDB and therefore has no implementation 
            throw new Error('Method not implemented.');
        }

    getUserTeam(username: string): Promise<TeamModel | null> {
    // not used before creating teamDB and therefore has no implementation 
        throw new Error('Method not implemented.');
    }

    getTeamPlayers(username: string): Promise<TeamPlayers[] | undefined> {
        // not used before creating teamDB and therefore has no implementation
        throw new Error('Method not implemented.');
    }
}