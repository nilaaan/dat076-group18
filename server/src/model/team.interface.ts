import { Player } from './player.interface'; 

export interface Team {  // represents the user's team of players
    players: Player[]; 
    balance: number; 
    points: number;
}



