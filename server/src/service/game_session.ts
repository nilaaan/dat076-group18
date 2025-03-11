import { error } from 'console';
import { Game_sessionModel } from '../db/game_session.db';
import { User_games } from '../db/user_game.db';
import { IGameSessionService} from './game_session.interface';
import { ClubModel } from '../db/club.db';

export class GameSessionService implements IGameSessionService {

    private time_frame = 38 * 2 * 24;    // in hours for real version

    private test_timeframe = 10 * 38    // in minutes for testing (each round is 10 minutes: the first 8 minutes is the 
                                        // window where the user can form team/change players, the 2 last minutes is when 
                                        // the matches are being played and the user can't change players)

    private test_round_time = 10;   // in minutes 

    // dont even know if it should be async
    async handleLogin(user_id: number) : Promise<void> {    // might be username that has to be passed instead of user_id, but in that case, just extract user_id 
        const isGameSession = await this.isGameSession(user_id);
        if (!isGameSession) {
            return;
        }
        // TRIGGER IF NOT GAMESESSION: DO NOTHING (JUST WAIT FOR START GAME) (TAKEN CARE OF BY GameSession CLASS), THE START GAME BUTTON CHECKS THE SAME CONDITION AND ONLY EXISTS WHILE TRUE
        // this.gamesessionservice.isGameSession(). 


        // maybe add a isGameSessionfinished(), returns, and easy for frontend know when to display appropriate text 

        const isAfterMatches = await this.isAfterMatches(user_id);
        if (isAfterMatches) {   
            // MOVE ALL THIS TO UPDATE STATE METHOD
            const current_round = await this.getCurrentRound(user_id);
            let user_round = await this.getUserRound(user_id);
            if (!current_round || !user_round) {
                console.error(`User ${user_id} does not have a game session`);
                return;
            }
            /*const nr_of_rounds_behind = current_round - user_round;
            for (let i = 0; i < nr_of_rounds_behind; i++) {
                // updateRound() --> increment round in Schedule table by 1
                // updateState() --> is called everytime user logs in and the date is after matches of the round the user last logged in
                // needs to updated the tables, collect points, one round at a time, until the current round is reached
            }   */
            while (user_round < current_round) {
                // updateState() --> is called everytime user logs in and the date is after matches of the round the user last logged in
                // updateRound() --> increment round in Schedule table by 1
                // needs to updated the tables, collect points, one round at a time, until the current round is reached
                user_round++;
            }
        }    
        // IF GAMESESSION: Check the date/round etc. update all relevant data (players data and team points) (TAKEN CARE OF BY Point system CLASS)
        // gamesession.isAfterMatches --> update all relevant data (players data and team points) (TAKEN CARE OF BY Point system CLASS)
        


        // playerService.updatePlayerData() --> update all player data (TAKEN CARE OF BY PlayerService CLASS)
        // (Previous rating ska vara rond 5 ratings och next rating ska vara rond 6 ratings)

        // teamService.updateTeamPoints() --> update all team points (TAKEN CARE OF BY TeamService CLASS)
        // else do nothing (means it's before or during the matches, during matches taken care of by buy/sell methods)

        // need to add if current_round is 0, i.e. the league is over 
    }
                                 
    

    // checks if there is a game session with the given user_id
    // returns true if there is a game session, false otherwise
    async isGameSession(user_id : number) : Promise<boolean> {          // if we want to allow for multiple games, we need to check for user_id and current_round != 0
        const user_game = await User_games.findOne({ 
            where: { user_id: user_id } });             // add current_round != 0 if implementing multiple games       

        if (user_game) { 
            return true;
        }
        return false;
    }
    
    
    // if there is a game session that is still on round 1 (according to the getRound() method, not database round), create new game session with the same id and this user_id
    // otherwise start 

    // assigns a new game session to the user with the given user id
    // if there exists a game session where the matches of the first round haven't been played yet, that one is assigned to the user
    // otherwise if all existing game sessions are already in progress, a new one is started and assigned to the user
    // returns the game session that was assigned to the user
    async startGameSession(user_id : number) : Promise<Game_sessionModel> {
        const game_sessions = await Game_sessionModel.findAll();
        const current_date = new Date();
        for (const game_session of game_sessions) {
            const round1matchestime = this.getFirstRoundMatchesStart(game_session.start_date);
            if (current_date.getTime() < round1matchestime.getTime()) {
                await User_games.create({ user_id: user_id, game_id: game_session.id, current_round: 1 });
                return game_session;
            }
        }
        const newGameSession = await Game_sessionModel.create({ start_date: current_date });
        await User_games.create({ user_id: user_id, game_id: newGameSession.id, current_round: 1 });
        return newGameSession;
    }

    // isBeforeMatches()
        // get current date and time
        // if it's before match time return true

    async isMatchesInProgress(user_id: number): Promise<boolean | undefined> {
        const current_date = new Date();
        const current_round = await this.getCurrentRound(user_id);
        if (!current_round) {
            console.error(`User ${user_id} does not have a game session`);
            return undefined;
        }

        const start_date = await this.getUserGameStartDate(user_id);
        if (!start_date) {
            console.error(`User ${user_id} does not have a game session`);
            return undefined;
        }
        
        const current_round_start = new Date(start_date.getTime() + (current_round - 1) * this.test_round_time * 60 * 1000);
        const current_round_match_start = new Date(current_round_start.getTime() + 8 * 60 * 1000);      // Matches start at the 8th minute
        const current_round_match_end = new Date(current_round_start.getTime() + 10 * 60 * 1000);       // Matches end at the 10th minute
        return current_date >= current_round_match_start && current_date <= current_round_match_end;
    }

    async isAfterMatches(user_id: number): Promise<boolean | undefined> {
        const user_game_round = await this.getUserRound(user_id);
        const current_round = await this.getCurrentRound(user_id);
        if (!user_game_round || !current_round) {
            console.error(`User ${user_id} does not have a game session`);
            return undefined;
        }

        if (user_game_round < current_round) {
            return true;
        }
        return false; 
    }
        
        // if getRound is greater than current round in table then return true
        // issue: what if the user logs in after 5 matches have been played?
        // we want the same team to have collected points normally during all games 


    // clarify that this reflects the actual current round based on the start date of the game session, '
    // in constrast to user_round which is the last round the user logged in
    async getCurrentRound(user_id: number) : Promise <number | undefined> {
        const start_date = await this.getUserGameStartDate(user_id);
        if (!start_date) {
            console.error(`User ${user_id} does not have a game session`);
            return undefined;
        }
        const time_difference = this.getTimeDifferenceFromStart(start_date);
        const current_round = Math.floor(time_difference / this.test_round_time) + 1;
        
        if (current_round > 38) {
            return 39; 
        }
        return current_round
    }


    async getUserGame(user_id: number) : Promise<User_games | null> {
        const user_game = await User_games.findOne({ where: { user_id: user_id } });
        return user_game;
    }


    async getUserRound(user_id: number) : Promise<number | undefined> {
        const user_game = await this.getUserGame(user_id);
        if (!user_game) {
            console.error(`User ${user_id} does not have a game session`);
            return undefined;
        }
        return user_game.current_round;
    }


    async getUserGameStartDate(user_id: number) {
        const user_game = await this.getUserGame(user_id);
        if (!user_game) {
            console.error(`User ${user_id} does not have a game session`);
            return undefined;
        }

        const game_session = await Game_sessionModel.findOne({ where: { id: user_game.game_id } });
        if (!game_session) {
            console.error(`Game session with id ${user_game.game_id} does not exist`);
            return undefined;
        }

        return game_session.start_date;
    }


    // increments the current round of the user gamesession by one
    async incrementRound(user_id: number) : Promise<void> {
        const user_game = await this.getUserGame(user_id);
        if (!user_game) {
            console.error(`User ${user_id} does not have a game session`);
            return;
        }
        user_game.current_round++;
    }
      
    

    // getMatchDate()
        // returns the date of the match in the current round (for matches will be player the 12/3 20.45.... )
        // assumes that current round is updated to its correct value


    // is called everytime user logs in and the date is after matches of the round the user last logged in
    // needs to updated the tables, collect points, one round at a time, until the current round is reached
    async updateState(user_id : number) : Promise<void> {
        // Let's say we are on user_round 5 loop: 
        // call playerService.updatePlayerStats() --> update all player data (TAKEN CARE OF BY PlayerService CLASS)
            // (Previous rating should be round 5 ratings and next rating should be round 6 ratings)

        // call teamService.updateTeamPoints() --> update all team points (TAKEN CARE OF BY TeamService CLASS)
        // call incrementRound() --> increment round in Schedule table by 1 (increment from round 5 to 6)
    }
        

    // returns the time difference between the current date and the given start date in minutes
    getTimeDifferenceFromStart(start_date: Date) {  // will probably change to hours when implementing real version
        const current_date = new Date();
        const difference_in_ms =  current_date.getTime() - start_date.getTime();
        const difference_in_min = difference_in_ms / (1000 * 60);
        return difference_in_min;
    }

    getFirstRoundMatchesStart(start_date: Date) {    // if not used, just remove this 
        const end_date = new Date(start_date.getTime() + 8 * 60 * 1000); // Add 8 minutes in milliseconds
        return end_date;
    }


}
