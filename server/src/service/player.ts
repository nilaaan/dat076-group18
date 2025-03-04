import { Player } from '../model/player.interface';
import { fetchAllLeaguePlayers } from './api'

export class PlayerService {
    private players: Player[] = [];

    constructor() {
        this.loadPlayers();
    }

    private async loadPlayers() {
        try {
            this.players = await fetchAllLeaguePlayers(39, 2022); // 39 = Premier League
            //console.log("Players loaded:", this.players);
        } catch (error) {
            console.error("Failed to fetch players:", error);
        }
    }

    // returns a copy of a specific player 
    async getPlayer(id: number): Promise<Player | undefined> {
        const player = this.players.find((player) => player.id === id);
        if (!player) {
            return undefined;
        }
        return { ...player };
    }

    // returns a specific player by reference
    // returns undefined if no player with that id number exists
    getPlayerObject(id: number): Player | undefined {
        return this.players.find((player) => player.id === id);
    }

    // returns a deep copy of all existing players 
    async getPlayers(): Promise<Player[]> {
        return JSON.parse(JSON.stringify(this.players));
    }
}