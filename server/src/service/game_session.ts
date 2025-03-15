import { error } from 'console';
import { Game_sessionModel } from '../db/game_session.db';
import { User_games } from '../db/user_game.db';
import { IGameSessionService } from './game_session.interface';
import { ClubModel } from '../db/club.db';
import { IPlayerService } from './player.interface';
import { ITeamService } from './team.interface';
import { ITeamStateService } from './team_state.interface';
import { IUserService } from './user.interface';


export class GameSessionService implements IGameSessionService {
    private time_frame = 38 * 2 * 24;    // in hours for real version

    private test_timeframe = 10 * 38    // in minutes for testing (each round is 10 minutes: the first 8 minutes is the 
    // window where the user can form team/change players, the 2 last minutes is when 
    // the matches are being played and the user can't change players)

    private test_round_time = 10;   // in minutes 

    private teamService: ITeamStateService | null = null;
    private userService: IUserService | null = null;


    setTeamService(teamService: ITeamStateService): void {
        this.teamService = teamService;
    }

    setUserService(userService: IUserService): void {
        this.userService = userService;
    }

    // is called everytime user logs in or is logged in and navigates to the matches page 
    // needs to update the tables, collect points, one round at a time, until the current round is reached


    // assigns a new game session to the user with the given user id
    // if there exists a game session where the matches of the first round haven't been played yet, that one is assigned to the user
    // otherwise if all existing game sessions are already in progress, a new one is started and assigned to the user
    // returns the game session that was assigned to the user
    async startGameSession(username: string): Promise<boolean | undefined> {
        const user_id = await this.getUserId(username);
        if (!user_id) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }

        // check if user already has a game session
        const isGameSession = await this.isGameSession(username);
        if (isGameSession) {
            console.error(`User ${username} already has a game session`);
            return undefined;
        }


        const game_sessions = await Game_sessionModel.findAll();
        const current_date = new Date();
        for (const game_session of game_sessions) {
            const round1matchestime = this.getFirstRoundMatchesStart(game_session.start_date);
            if (current_date.getTime() < round1matchestime.getTime()) {
                await User_games.create({ user_id: user_id, game_id: game_session.id, current_round: 1 });
                return true; 
            }
        }
        const newGameSession = await Game_sessionModel.create({ start_date: current_date });
        await User_games.create({ user_id: user_id, game_id: newGameSession.id, current_round: 1 });
        return true;
    }

    
    // checks if there is a game session with the given user_id
    // returns true if there is a game session, false otherwise
    async isGameSession(username: string): Promise<boolean | undefined> {  // if we want to allow for multiple games, we need to check for user_id and current_round != 0
        const user_game = await this.getUserGame(username)  
        
        if (user_game === undefined) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }
        
        if (user_game) {
            return true;
        }
        return false;
    }


    // updates the state of the user's game session
    async updateState(username: string): Promise<boolean | undefined> {
        const isGameSession = await this.isGameSession(username);

        if (!isGameSession) {
            return true;
        }

        const isAfterMatches = await this.isAfterMatches(username);

        if (isAfterMatches) {
            
            const current_round= await this.getCurrentRound(username);
            console.log("REAL CURRENT ROUND FOR USER " + username + " IS " + current_round);
            let user_round = await this.getUserRound(username);

            if (!current_round || !user_round) {
                console.error(`User ${username} does not have a game session`);
                return undefined;
            }
            
            // updates state one round at a time until the user's gamesession round reaches the current round 
            while (user_round < current_round) {
                await this.incrementUserRound(username);
                user_round++;

                const isTeamPointsUpdated = await this.teamService?.updateTeamPoints(username);
                if (!isTeamPointsUpdated) {
                    throw new Error(`Failed to update team points for user ${username} in round ${user_round}`);   
                }
            }
        }
        return true; 
    }


    // if there is a game session that is still on round 1 (according to the getRound() method, not database round), create new game session with the same id and this user_id
    // otherwise start 


    // isBeforeMatches()
    // get current date and time
    // if it's before match time return true


    async isMatchesInProgress(username: string): Promise<boolean | undefined> {
        const isGameSession = await this.isGameSession(username);
        if (!isGameSession) {
            return false;
        }

        const current_date = new Date();
        const current_round = await this.getCurrentRound(username);
        if (!current_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }

        const start_date = await this.getUserGameStartDate(username);
        if (!start_date) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }

        const current_round_start = new Date(start_date.getTime() + (current_round - 1) * this.test_round_time * 60 * 1000);
        const current_round_match_start = new Date(current_round_start.getTime() + 8 * 60 * 1000);      // Matches start at the 8th minute
        const current_round_match_end = new Date(current_round_start.getTime() + 10 * 60 * 1000);       // Matches end at the 10th minute
        return current_date >= current_round_match_start && current_date <= current_round_match_end;
    }


    async isAfterMatches(username: string): Promise<boolean | undefined> {
        const user_game_round = await this.getUserRound(username);
        const current_round = await this.getCurrentRound(username);

        console.log("USER GAME ROUND: " + user_game_round + " AND CURRENT ROUND: " + current_round);

        if (!user_game_round || !current_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }

        if (user_game_round < current_round) {
            console.log("User " + username + " HAS TRUE CURRENT ROUND : " + current_round + " AND USER ROUND: " + user_game_round);
            return true;
        }
        return false;
    }



    async isGameSessionFinished(username: string): Promise<boolean | undefined> {
        const isGameSession = await this.isGameSession(username);
        if (!isGameSession) {
            return false;
        }

        const user_round = await this.getUserRound(username);
        if (!user_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }

        if (user_round > 38) {
            return true;
        } else {
            return false;
        }
    };



    // if getRound is greater than current round in table then return true
    // issue: what if the user logs in after 5 matches have been played?
    // we want the same team to have collected points normally during all games 
    // clarify that this reflects the actual current round based on the start date of the game session, '
    // in constrast to user_round which is the last round the user logged in
    async getCurrentRound(username: string): Promise<number | undefined> {
        const start_date = await this.getUserGameStartDate(username);
        if (!start_date) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }

        console.log("START DATE: " + start_date);

        const time_difference = this.getTimeDifferenceFromStart(start_date);
        const current_round = Math.floor(time_difference / this.test_round_time) + 1;

        console.log("CURRENT ROUND: " + current_round);

        if (current_round > 38) {
            return 39;
        } else {
            return current_round;
        }
    }


    async getUserGame(username: string): Promise<User_games | null | undefined> {
        const user_id = await this.getUserId(username);
        if (!user_id) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }
        const user_game = await User_games.findOne({ where: { user_id: user_id } });
        return user_game;
    }


    async getUserRound(username: string): Promise<number | undefined> {
        const user_id = await this.getUserId(username);
        if (!user_id) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }    
        const user_game = await this.getUserGame(username);
        if (!user_game) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        return Number(user_game.current_round);
    }


    async getUserGameStartDate(username: string) {
        const user_game = await this.getUserGame(username);
        if (!user_game) {
            console.error(`User ${username} does not have a game session`);
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
    async incrementUserRound(username: string): Promise<void> {
        const user_game = await this.getUserGame(username);
        if (!user_game) {
            console.error(`User ${username} does not have a game session`);
            return;
        }
        const user_round = await this.getUserRound(username);
        if (!user_round) {
            console.error(`User ${username} does not have a game session`);
            return;
        }
        const new_round = Number(user_round) + 1;
        await user_game.update({ current_round: new_round }); 
    }



    // getMatchDate()
    // returns the date of the match in the current round (for matches will be player the 12/3 20.45.... )
    // assumes that current round is updated to its correct value


    // returns the time difference between the current date and the given start date in minutes
    getTimeDifferenceFromStart(start_date: Date) {  // will probably change to hours when implementing real version
        const current_date = new Date();
        const difference_in_ms = current_date.getTime() - start_date.getTime();
        const difference_in_min = difference_in_ms / (1000 * 60);
        return difference_in_min;
    }


    getFirstRoundMatchesStart(start_date: Date) {    // if not used, just remove this 
        const end_date = new Date(start_date.getTime() + 8 * 60 * 1000); // Add 8 minutes in milliseconds
        return end_date;
    }


    async getUserId(username: string) : Promise<number | undefined> {
        const user = await this.userService?.findUser(username);
        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }
        return user.id;
    }


    async getGameSessionId(username: string): Promise<number | undefined> {
        const user_game = await this.getUserGame(username);
        if (!user_game) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        return user_game.game_id;
    }


}
