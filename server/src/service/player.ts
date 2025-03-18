import { Player } from '../model/player.interface';
import { fetchAllLeaguePlayers } from './api'
import { IPlayerService } from './player.interface';

// Takes care of all player related operations
// Stores all players in memory 
export class PlayerService implements IPlayerService {

    private players: Player[] = [ 
        {
            id: 1, 
            name: "Test player1",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 10,
            image: "img1",
        },
        {
            id: 2, 
            name: "Test player2",
            position: "Forward",
            number: 9,
            club: "Test Club",
            price: 10,
            image: "img2",
        },
        {
            id: 3, 
            name: "Test player3",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 5,
            image: "img3",
        },
        {
            id: 4, 
            name: "Test player4",
            position: "Defender",
            number: 5,
            club: "Test Club",
            price: 5,
            image: "img4",
        },
        {
            id: 5, 
            name: "Test player5",
            position: "Midfielder",
            number: 10,
            club: "Test Club",
            price: 200000000,
            image: "img5",
        }
    ];

    // returns a copy of a specific player 
    async getPlayer(id: number): Promise<Player | undefined> {
        if (id < 0) {
            throw new Error('Invalid id, must be positive integer');
        }
        const player = this.players.find((player) => player.id === id);
        if (!player) {
            return undefined;
        }
        return { ...player };
    }

    // returns a specific player by reference
    // returns undefined if no player with that id number exists
    getPlayerObject(id: number): Player | undefined {
        if (id < 0) {
            console.error('Invalid id, must be positive integer');
            return undefined;
        }
        return this.players.find((player) => player.id === id);
    }


    // returns a deep copy of all existing players 
    async getPlayers(): Promise<Player[]> {
        return JSON.parse(JSON.stringify(this.players));
    }


    getPlayerByIds(ids: number[]): Promise<Player[] | undefined> {
        // not used before creating playerDB and therefore has no implementation
        throw new Error('Method not implemented.');
    }


    async getRoundRating(player_id: number, round: number): Promise<number | null | undefined> {
        // not used before creating playerDB and therefore has no implementation 
        throw new Error('Method not implemented.');
    }


    async getRoundAvailability(player_id: number, round: number): Promise<boolean | undefined> {
        // not used before creating playerDB and therefore has no implementation 
        throw new Error('Method not implemented.');
    }


    async getRecentForm(player_id: number, round: number): Promise<number | null | undefined> {
        // not used before creating playerDB and therefore has no implementation 
        throw new Error('Method not implemented.');
    }

    async getTopPerformers(round: number): Promise<Player[] | undefined> {
        // not used before creating playerDB and therefore has no implementation 
        throw new Error('Method not implemented.');
    }
}
