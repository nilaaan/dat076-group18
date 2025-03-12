export interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    club: string;
    price: number;
    available: boolean;
    points: number;
    image: string;
}

export interface Team {
    players: Player[];
    balance: number;
    points: number;
}

export interface User {
    id: number; 
    username : string;
    password : string;
    team : Team;
}