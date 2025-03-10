import { User_game } from '../db/user_game.db';
import { IGameSessionService} from './game_session.interface';

export class GameSessionService implements IGameSessionService {

    time_frame = 76; // days 

    // checks if there is a game session with the given user_id
    // returns true if there is a game session, false otherwise
    async isGameSession(user_id : number) : Promise<boolean> {          // if we want to allow for multiple games, we need to check for user_id and current_round != 0
        const user_game = await User_game.findOne({ 
            where: { user_id: user_id } });             // add current_round != 0 if implementing multiple games       

        if (user_game) { 
            return true;
        }
        return false;
    }
        

    // startGameSession()   
        // if there is a game session that is still on round 1, create new game session with the same id and this user_id
        // otherwise start 

    // isBeforeMatches()
        // get current date and time
        // if it's before match time return true

    // isMatchesInProgress()
        // get current date and time
        // if it's match day and time is between start and end time of the match return true

    // isAfterMatches()
        // if getRound is one greater than current round in table then return true

    async getRound() {
        // get start date in Schedule table
        // get current date 
        // calculate round number
    }

    // updateRound()
        // increment round in Schedule table by 1
    

    // getMatchDate()
        // returns the date of the match in the current round (for matches will be player the 12/3 20.45.... )
        // assumes that current round is updated to its correct value

    }
