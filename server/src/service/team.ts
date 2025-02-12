import { Team } from '../model/team.interface';  
import { Player } from '../model/player.interface'; 
import { PlayerService } from './player'; 


export class TeamService {
    private team: Team; 

    constructor(private playerService: PlayerService) {
        this.team = { players: [{
            id: 1, 
            name: "Test player1",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 1000000,
            available: false,
            points: 0
        }, {
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 500000,
            available: false,
            points: 0
        }], 
        balance: 100000000 }; 
    }

    // returns the current balance of the user's team 
    async getBalance() : Promise<number> {
        return this.team.balance; 
    }

    // returns a specific player from the user's team
    // returns undefined if no player with that id number exists in the user's team
    async getPlayer(id : number) : Promise<Player | undefined> {
        const player = this.team.players.find((player) => player.id === id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        return {... player}; 
    }

    // returns all players from the user's team 
    async getPlayers() : Promise <Player[]> {
        return JSON.parse(JSON.stringify(this.team.players));
    }

    // buys a player to the user's team, marking the player as unavailable to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist or if the user has insufficient balance
    async buyPlayer(id: number) : Promise <Player | undefined> {
        const player = this.playerService.getPlayerObject(id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        if (! player.available) {
            console.error(`Player not available: ${id}`);
            return undefined; 
        }

        if (player.price > this.team.balance) {
            console.error(`Insufficient balance to buy player: ${id}`); 
            return undefined; 
        }

        if (this.team.players.find((player) => player.id === id)) {
            console.error(`Player already in team: ${id}`);
            return undefined; 
        }

        player.available = false; 
        this.team.players.push(player);
        this.team.balance -= player.price; 
        return { ...player };
    }

    // sells a player from the user's team, marking the player as available to be picked by other users and updating the user's balance
    // returns undefined if the player does not exist in the user's team
    async sellPlayer(id : number) : Promise <Player | undefined> {
        const player = await this.getPlayer(id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }

        const indexToRemove = this.team.players.findIndex((player) => player.id === id);
        if (indexToRemove !== -1) {
            this.team.players.splice(indexToRemove, 1);
        }

        this.team.balance += player.price; 
        player.available = true; 
        return { ...player };
    }
}