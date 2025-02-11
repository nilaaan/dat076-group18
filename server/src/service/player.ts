import { Player } from '../model/player.interface';  

export class PlayerService {
    private players: Player[] = [];


    // returns a specific player from the in-memory state (if api has id, use id instead of (name, number, club))
    async getPlayer(id: number) : Promise<Player | undefined> {
        const player = this.players.find((player) => player.id === id);
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
                id : playerData.id,
                name: playerData.name, 
                position: playerData.position, 
                number: playerData.number, 
                club: playerData.club,
                price: playerData.price, 
                available: true, 
                points: 0
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

    // marks a player as available to be picked to the user's team 
    async toggleAvailable(id : number) : Promise<Player | undefined> {
        const player = this.players.find((player) => player.id === id);
        if (! player) {
            console.error(`Player not found: ${id}`);
            return undefined;
        }
        player.available = !player.available;
        return { ...player };
    }
}
