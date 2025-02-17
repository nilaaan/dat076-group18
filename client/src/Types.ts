export interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    club: string;
    price: number;
    available: boolean;
    points: number;
}

export interface Team {
    players: Player[];
    balance: number;
}