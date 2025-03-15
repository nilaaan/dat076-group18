import { Game_sessionModel } from '../db/game_session.db';
import { UserModel } from '../db/user.db';
import { User_games } from '../db/user_game.db';
import { User } from '../model/user.interface';
import { IGameSessionService } from './game_session.interface';
import { IPointSystemService } from './pointsystem.interface';
import { IUserService } from './user.interface';


export class PointSystemService implements IPointSystemService {

    
    calculatePoints(rating: number | null) : number | undefined {
        if (rating === null) {
            console.log("got heere");
            console.log("rating is: " + rating);
            return 0;
        }
        if (rating < 0 || rating > 10) {
            console.error("Rating must be between 0 and 10.");
            return undefined; 
        }
        
        const a = 0.5;
        const b = 2;

        return a * Math.pow(rating, 2) + b * rating;
    };
}
