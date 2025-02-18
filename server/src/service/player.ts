import { Player } from '../model/player.interface';  

export class PlayerService {
    private players: Player[] = [ /*{
        id: 1, 
        name: "Test player1",
        position: "Forward",
        number: 10,
        club: "Test Club",
        price: 1000000,
        available: true,
        points: 0
    },{
        id: 2, 
        name: "Test player2",
        position: "Forward",
        number: 9,
        club: "Test Club",
        price: 1000000,
        available: false,
        points: 0
    },{
        id: 3, 
        name: "Test player3",
        position: "Defender",
        number: 3,
        club: "Test Club",
        price: 500000,
        available: false,
        points: 0
    },{
        id: 4, 
        name: "Test player4",
        position: "Defender",
        number: 5,
        club: "Test Club",
        price: 500000,
        available: true,
        points: 0
    },{
        id: 5, 
        name: "Test player5",
        position: "Midfielder",
        number: 10,
        club: "Test Club",
        price: 200000000,
        available: true,
        points: 0
    }*/
        {
            id: 8, 
            name: "Test player8",
            position: "Forward",
            number: 10,
            club: "Test Club",
            price: 10,
            available: true,
            points: 0
        },
        {
            id: 9, 
            name: "Test player9",
            position: "Forward",
            number: 9,
            club: "Test Club",
            price: 10,
            available: true,
            points: 0
        },
        {
            id: 10, 
            name: "Test player10",
            position: "Defender",
            number: 3,
            club: "Test Club",
            price: 5,
            available: true,
            points: 0
        },
        {
            id: 11, 
            name: "Test player11",
            position: "Defender",
            number: 5,
            club: "Test Club",
            price: 5,
            available: true,
            points: 0
        },
        {
            id: 12, 
            name: "Test player12",
            position: "Midfielder",
            number: 10,
            club: "Test Club",
            price: 20,
            available: true,
            points: 0
        }
    ];

    // returns a copy of a specific player 
    async getPlayer(id: number) : Promise<Player | undefined> {
        const player = this.players.find((player) => player.id === id);
        if (! player) {
            return undefined;
        }
        return { ...player }; 
    }

    // returns a specific player by reference
    // returns undefined if no player with that id number exists
    getPlayerObject(id: number) : Player | undefined {
        return this.players.find((player) => player.id === id);
    }

    // returns a deep copy of all existing players 
    async getPlayers() : Promise<Player[]> {
        return JSON.parse(JSON.stringify(this.players));
    }
}
