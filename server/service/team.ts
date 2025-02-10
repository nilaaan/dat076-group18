import { Team } from '../model/team.interface';  
import { Player } from '../model/player.interface'; 
import { PlayerService } from './player'; 


export class TeamService {
    private team: Team; 

    constructor(private playerService: PlayerService) {
        this.team = { players: [], balance: 100000000 }; // Initialize with no players and default balance
    }

    // returns the current balance of the user's team 
    async getBalance() : Promise<number> {
        return this.team.balance; 
    }

    // returns a specific player from the user's team, (if api has id, use id instead of (name, number, club))
    async getPlayer(id : number) : Promise<Player | undefined> {
        const player = this.team.players.find((player) => player.id === id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        return player; 
    }

    // returns all players from the user's team 
    async getPlayers() : Promise <Player[]> {
        return this.team.players; 
    }

    // buys a player to the user's team, marking the player as unavailable to be picked by other users and updating the user's balance
    async buyPlayer(id: number) : Promise <Player | undefined> {
        const player = await this.playerService.getPlayer(id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        if (player.price > this.team.balance) {
            console.error(`Insufficient balance to buy player: ${id}`); 
            return undefined; 
        }

        player.available = false; 
        this.team.players.push(player);
        this.team.balance -= player.price; 
        return { ...player };
    }

    // sells a player from the user's team, marking the player as available to be picked by other users and updating the user's balance
    async sellPlayer(id : number) : Promise <Player | undefined> {
        const player = await this.getPlayer(id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        player.available = true; 
        const indexToRemove = this.team.players.findIndex((player) => player.id === id);
        if (indexToRemove !== -1) {
            this.team.players.splice(indexToRemove, 1);
        }
        this.team.balance += player.price; 
        return { ...player };
    }
}