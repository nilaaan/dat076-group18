import { Team } from "./team.interface";

export interface User {
    username : string;
    password : string;
    team : Team;
}