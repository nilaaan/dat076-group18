import { Player } from '../model/player.interface';  

export class PlayerService {
    private players: Player[] = [];


    // returns a specific player from the in-memory state
    async getPlayer(name: string, number: number, club: string) : Promise<Player | undefined> {
        const player = this.players.find((player) => player.name === name && player.number === number && player.club === club);
        if (! player) {
            return undefined;
        }
        return player; 
    }

    // returns all existing players 
    async getPlayers() : Promise<Player[]> {
        return JSON.parse(JSON.stringify(this.players));
    }

    // adds a player to the in-memory state
    async addPlayer(apiURL : string) : Promise<Player> {
        try {
            const response = await fetch(apiURL); 
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const playerData = await response.json();

            const player = {
                name: playerData.name, 
                position: playerData.position, 
                number: playerData.number, 
                club: playerData.club,
                price: playerData.price, 
                available: true, 
                points: playerData.points
            };

            this.players.push(player);
            return { ...player };
        }
        catch (error) {
            console.error('Error adding player:', error);
            throw error; 
        }   
    }


    // perhaps markAvailable() and markUnavailable() not needed:

    // marks a player as unavailable to be picked to the user's team 
    async markUnavailable(name: string, number: number, club: string) : Promise<Player | undefined> {
        const player = this.players.find((player) => player.name === name && player.number === number && player.club === club);
        if (! player) {
            console.error(`Player not found: ${name}, ${number}, ${club}`);
            return undefined;
        }
        player.available = false;
        return { ...player };
    }

    // marks a player as available to be picked to the user's team 
    async markAvailable(name: string, number: number, club: string) : Promise<Player | undefined> {
        const player = this.players.find((player) => player.name === name && player.number === number && player.club === club);
        if (! player) {
            console.error(`Player not found: ${name}, ${number}, ${club}`);
            return undefined;
        }
        player.available = true;
        return { ...player };
    }
}
