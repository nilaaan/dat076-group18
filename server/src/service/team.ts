import { Team } from '../model/team.interface';  
import { Player } from '../model/player.interface'; 
import { PlayerService } from './player'; 
import { AuthService } from './auth';
import { User } from '../model/user.interface';
import { IUserService } from './user.interface';
import { ITeamService } from './team.interface';


export class TeamService implements ITeamService {
    private userService; 
    private playerService;  

    constructor(userService: IUserService, playerService: PlayerService) {
        this.userService = userService;
        this.playerService = playerService; 
    }

    // returns the current balance of the user's team 
    async getBalance(username: string) : Promise<number | undefined> {
        const user : User | null = await this.userService.findUser(username);
        if (! user) {
            return undefined
        }
        return user.team.balance;
    }

    // returns a specific player from the user's team
    // returns undefined if no player with that id number exists in the user's team
    async getPlayer(username: string, id : number) : Promise<Player | undefined> {
        const user : User | null = await this.userService.findUser(username);
        if (! user) {
            return undefined
        }
        const player = user.team.players.find((player) => player.id === id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        return {... player}; 
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
        const user : User | null = await this.userService.findUser(username);
        if (! user) {
            return undefined
        }
        return JSON.parse(JSON.stringify(user.team.players));
    }
    
    // buys a player to the user's team, marking the player as unavailable to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist or if the user has insufficient balance
    async buyPlayer(username: string, id: number) : Promise <Player | undefined> {
        const user : User | null = await this.userService.findUser(username);
        if (! user) {
            return undefined
        }
        const player = this.playerService.getPlayerObject(id);
        if (! player) {
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

    // sells a player from the user's team, marking the player as available to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist in the user's team
    async sellPlayer(username: string, id : number) : Promise <Player | undefined> {
        const user : User | null = await this.userService.findUser(username);
        if (! user) {
            return undefined
        }
        const player = await this.getPlayerObject(username, id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        
        this.removePlayer(user, player.id);
        this.increaseBalance(user, player.price);
        return { ...player };
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
}