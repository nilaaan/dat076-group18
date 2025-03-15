import { User } from "../model/user.interface";

export interface IPointSystemService {

    calculatePoints(rating: number | null) : number | undefined; 

}