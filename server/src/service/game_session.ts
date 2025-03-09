import { IGameSessionService} from './game_session.interface';

export class GameSessionService implements IGameSessionService {

    time_frame = 76; // days 


    // isGameSession()
        // check if there is a game session with the given user_id

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

    }
