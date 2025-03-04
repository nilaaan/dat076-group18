import { Team } from '../model/team.interface';  
import { Player } from '../model/player.interface'; 
import { PlayerService } from './player'; 
import { AuthService } from './auth';
import { User } from '../model/user.interface';


export class TeamService {
    private authService; 
    private playerService;  

    constructor(authService: AuthService, playerService: PlayerService) {
        this.authService = authService;
        this.playerService = playerService; 
    }

    // returns the current balance of the user's team 
    async getBalance(username: string) : Promise<number | undefined> {
        const user : User | null = await this.authService.findUser(username);
        if (! user) {
            return undefined
        }
        return user.team.balance;
    }

    // returns a specific player from the user's team
    // returns undefined if no player with that id number exists in the user's team
    async getPlayer(username: string, id : number) : Promise<Player | undefined> {
        const user : User | null = await this.authService.findUser(username);
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
        const user : User | null = await this.authService.findUser(username);
        if (! user) {
            return undefined
        }
        return user.team.players.find((player) => player.id === id);
    }

    // returns all players from the user's team 
    async getPlayers(username: string) : Promise <Player[] | undefined> {
        const user : User | null = await this.authService.findUser(username);
        if (! user) {
            return undefined
        }
        return JSON.parse(JSON.stringify(user.team.players));
    }

    // buys a player to the user's team, marking the player as unavailable to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist or if the user has insufficient balance
    async buyPlayer(username: string, id: number) : Promise <Player | undefined> {
        const user : User | null = await this.authService.findUser(username);
        if (! user) {
            return undefined
        }
        const player = this.playerService.getPlayerObject(id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        if (! player.available) {
            console.error(`Player not available: ${id}`);
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
        
        this.markPlayerUnavailable(player);
        this.addPlayer(user, player);
        this.decreaseBalance(user, player.price); 
        return { ...player };
    }

    // sells a player from the user's team, marking the player as available to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist in the user's team
    async sellPlayer(username: string, id : number) : Promise <Player | undefined> {
        const user : User | null = await this.authService.findUser(username);
        if (! user) {
            return undefined
        }
        const player = await this.getPlayerObject(username, id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        if (this.checkForTeamSize(user)) {        
        this.markPlayerAvailable(player);
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

    private checkForTeamSize(user: User): boolean {
        return user.team.players.length < 11;
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