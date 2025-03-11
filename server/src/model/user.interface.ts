import { Team } from "./team.interface";

export interface User {
    id: number; 
    username : string;
    password : string;
    team : Team;
}