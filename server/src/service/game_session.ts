import { error } from 'console';
import { Game_sessionModel } from '../db/game_session.db';
import { User_games } from '../db/user_game.db';
import { IGameSessionService } from './game_session.interface';
import { ClubModel } from '../db/club.db';
import { IPlayerService } from './player.interface';
import { ITeamService } from './team.interface';
import { ITeamStateService } from './team_state.interface';
import { IUserService } from './user.interface';
import { User } from '../model/user.interface';
import { UserModel } from '../db/user.db';

// Takes care of the game session logic
// Handles the communication with the Game_session and User_games database tables
export class GameSessionService implements IGameSessionService {
    private time_frame = 38 * 2 * 24;    // in hours for real version (each round is 2 days, and a given round's matches are played at 20.45 on the second day)
    private test_timeframe = 10 * 38    // in minutes for testing (each round is 10 minutes: the round matches are played at 8-10 minutes)

    private test_round_time = 10;   // in minutes (one round's time duration)

    private teamService: ITeamStateService | null = null;
    private userService: IUserService | null = null;


    setTeamService(teamService: ITeamStateService): void {
        this.teamService = teamService;
    }

    setUserService(userService: IUserService): void {
        this.userService = userService;
    }


    // Assigns a new game session to the user with the given user id
    // If there exists a game session where the league isn't over yet, that one is assigned to the user,
    // otherwise if all existing game sessions are already finished, a new one is started and assigned to the user
    // Returns true if the game session was successfully assigned
    // Returns undefined otherwise
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
        // check if there is a game session that is still in progress
        for (const game_session of game_sessions) {
            const game_session_round = await this.getGamesessionRound(game_session.id);
            if (!game_session_round) {
                console.error(`Game session with id ${game_session.id} does not exist`);
                return undefined;
            }
            const current_round = Number(game_session_round);
            if (current_round < 39) {
                await User_games.create({ user_id: user_id, game_id: game_session.id, current_round: current_round });
                return true; 
            }
        }
        // if there is no game session in progress, create a new gamesession and assign it to the user
        const newGameSession = await Game_sessionModel.create({ start_date: current_date, current_round: 1 });
        await User_games.create({ user_id: user_id, game_id: newGameSession.id, current_round: 1 });
        return true;
    }

    
    // Checks if there is a game session associated with the given user_id
    // Returns true if there is a game session, false otherwise
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


    // Updates the state of the given user's game session 
    async updateState(username: string): Promise<boolean | undefined> {
        const isGameSession = await this.isGameSession(username);
        if (!isGameSession) {
            return true;
        }
        
        // check if matches have been played since the user last logged in
        const isAfterMatches = await this.isAfterMatches(username);

        if (isAfterMatches) {
            // get the gamesession's current round based on its start date 
            const current_round= await this.getCurrentRound(username);
            // get the round the user was on when they last logged in
            let user_round = await this.getRound(username);

            if (!current_round || !user_round) {
                console.error(`User ${username} does not have a game session`);
                return undefined;
            }

            // update the current round in the game session database table
            const isGameSessionRoundUpdated = await this.updateGamesessionRound(username, current_round);
            if (!isGameSessionRoundUpdated) {
                console.error(`Failed to update game session round for user ${username}`);
                return undefined;
            }

            // update the state of the user's team and the user's current round round by round until the user's current round reaches the gamesession current round
            while (user_round < current_round) {
                const isTeamPointsUpdated = await this.teamService?.updateTeamPoints(username, user_round);
                if (!isTeamPointsUpdated) {
                    console.error(`Failed to update team points for user ${username} in round ${user_round}`);   
                    return undefined; 
                }

                await this.incrementUserRound(username);
                user_round++;
            }
        }
        return true; 
    }


    // Checks if matches are currently being played in the given user's game session
    // Returns true if matches are being played, false otherwise
    // Returns undefined if the user does not have a game session
    async isMatchesInProgress(username: string): Promise<boolean | undefined> {
        const isGameSession = await this.isGameSession(username);
        if (!isGameSession) {
            return false;
        }

        // get the current date
        const current_date = new Date();
        // get the current round of the user's game session
        const current_round = await this.getCurrentRound(username);
        if (!current_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        // get the start date of the user's game session
        const start_date = await this.getUserGameStartDate(username);
        if (!start_date) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        // check if the current date is within the time frame of the current round's matches
        const current_round_start = new Date(start_date.getTime() + (current_round - 1) * this.test_round_time * 60 * 1000);
        const current_round_match_start = new Date(current_round_start.getTime() + this.test_round_time * 0.8 * 60 * 1000);      // Matches start at the 8th minute
        const current_round_match_end = new Date(current_round_start.getTime() + this.test_round_time * 60 * 1000);       // Matches end at the 10th minute
        return current_date >= current_round_match_start && current_date <= current_round_match_end;
    }


    // Checks if the given user has logged in after the matches of the round the user was last logged in on have been played
    // Returns true if it is the case
    // Returns false otherwise
    // Returns undefined if the user does not have a gamesession
    private async isAfterMatches(username: string): Promise<boolean | undefined> {
        const user_game_round = await this.getRound(username);
        const current_round = await this.getCurrentRound(username);

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

    // Checks if the given user's game session is finished
    // Returns true if it is
    // Returns false otherwise
    async isGameSessionFinished(username: string): Promise<boolean | undefined> {
        const isGameSession = await this.isGameSession(username);
        if (!isGameSession) {
            return false;
        }

        const user_round = await this.getRound(username);
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
    
    // Returns the current round of the game session with the given id
    // Returns undefined if the game session with the given id does not exist
    private async getGamesessionRound(game_id: number): Promise<number | undefined> {
        if (game_id < 0) {
            console.error(`Game id must be a positive integer`);
            return undefined;
        }
        const game_session = await Game_sessionModel.findOne({ where: { id: game_id } });
        if (!game_session) {
            console.error(`Game session with id ${game_id} does not exist`);
            return undefined;
        }
        return game_session.current_round;
    }


    // Sets the current round of the game session with the given id to the given round
    // Returns true if the current round was successfully updated
    // Returns undefined if the game session with the given id does not exist
    private async setGamesessionRound(game_id: number, round: number): Promise<boolean | undefined> {
        if (game_id < 0) {
            console.error(`Game id must be a positive integer`);
            return undefined;
        }
        if (round < 1 || round > 39) {
            console.error(`Round must be a positive integer between 1 and 38`);
            return undefined;
        }
        const game_session = await Game_sessionModel.findOne({ where: { id: game_id } });
        if (!game_session) {
            console.error(`Game session with id ${game_id} does not exist`);
            return undefined;
        }
        await game_session.update({ current_round: round });
        return true; 
    }


    // Sets the current round of the game session that the given user belongs to to the given round
    // Returns true if the current round was successfully updated
    // Returns undefined if the game session does not exist
    private async updateGamesessionRound(username: string, round: number): Promise<boolean | undefined> {
        const game_session_id = await this.getGameSessionId(username);
        if (!game_session_id) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        if (round < 1 || round > 39) {
            console.error(`Round must be a positive integer between 1 and 38`);
            return undefined;
        }

        const isGameSessionRoundUpdated = await this.setGamesessionRound(game_session_id, round);
        if (!isGameSessionRoundUpdated) {
            console.error(`Failed to update game session round for gamession with id ${game_session_id}`);
            return undefined;
        }
        return true; 
    }


    // Returns the current round that the game session of the given user should be on to based on its start date
    // Returns undefined if the user does not have a game session
    private async getCurrentRound(username: string): Promise<number | undefined> {
        const start_date = await this.getUserGameStartDate(username);
        if (!start_date) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }

        const time_difference = this.getTimeDifferenceFromStart(start_date);
        const current_round = Math.floor(time_difference / this.test_round_time) + 1;

        if (current_round > 38) {
            return 39;
        } else {
            return current_round;
        }
    }

    // Returns a user_games row for the given user from the user_games database table
    private async getUserGame(username: string): Promise<User_games | null | undefined> {
        const user_id = await this.getUserId(username);
        if (!user_id) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }
        const user_game = await User_games.findOne({ where: { user_id: user_id } });
        return user_game;
    }

    // Returns the user's current round in the game session
    async getRound(username: string): Promise<number | undefined> {
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
        
        const round = Number(user_game.current_round);
        return round; 
    }

    // Returns the start date of the game session that the given user belongs to
    private async getUserGameStartDate(username: string) {
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


    // Increments the user's current round in the game session by one
    private async incrementUserRound(username: string): Promise<void> {
        const user_game = await this.getUserGame(username);
        if (!user_game) {
            console.error(`User ${username} does not have a game session`);
            return;
        }
        const user_round = await this.getRound(username);
        if (!user_round) {
            console.error(`User ${username} does not have a game session`);
            return;
        }
        const new_round = user_round + 1;
        await user_game.update({ current_round: new_round }); 
    }


    // Returns the time difference between the current date and the given start date in minutes 
    private getTimeDifferenceFromStart(start_date: Date) {  // will probably change to hours when implementing real version
        const current_date = new Date();
        const difference_in_ms = current_date.getTime() - start_date.getTime();
        const difference_in_min = difference_in_ms / (1000 * 60);
        return difference_in_min;
    }


    // Returns the user id of the given username
    private async getUserId(username: string) : Promise<number | undefined> {
        const user = await this.userService?.getUser(username);                  
        if (!user) {
            console.error(`User ${username} does not exist`);
            return undefined;
        }
        return user.id;
    }


    // Returns the game session id of the game session that the given user belongs to 
    async getGameSessionId(username: string): Promise<number | undefined> {
        const user_game = await this.getUserGame(username);
        if (!user_game) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        const game_id = Number(user_game.game_id);
        return game_id; 
    }


    // Returns the usernames of all users in the same game session that the given user belongs to
    async getGamesessionUsernames(username: string): Promise<string[] | undefined> {
        const isGameSession = await this.isGameSession(username);
        if (!isGameSession) {
            return [];  
        }
        const game_id = await this.getGameSessionId(username);
        if (!game_id) {
            console.error("No game session found for user: " + username);
            return undefined;  
        }

        // get all users in the game session
        const user_games = await User_games.findAll({
            where: {
                game_id: game_id
            }
        });

        let usernames : string[] = [];
        for (const user_game of user_games) {
            const userrow = await this.userService?.getUserById(user_game.user_id);
            if (!userrow) {
                console.error("No user found with id: " + user_game.user_id);
                return undefined;  
            }

            const gamesession_username = userrow.username
            usernames.push(gamesession_username);
        }
        return usernames; 
    }

    
    // Returns all usernames and their team points of the game session that the given user belongs to by descending order of team points
    async getLeaderboard(username: string): Promise<[string, number][] | undefined> {
        const usernames = await this.getGamesessionUsernames(username);
        if (!usernames) {
            console.error("No usernames found");
            return undefined;  
        }

        let users : User[]  = [];

        for (const username of usernames) {
            const user = await this.userService?.findUser(username);
            if (!user) {
                console.error("No user found with username: " + username);
                return undefined;  
            }
            users.push(user);
        }

        let leaderboard : [string, number][] = [];

        for (const user of users) {
            const points = Number(user.team.points);
            leaderboard.push([user.username, points]);
        }

        // sort the leaderboard by points in descending order
        leaderboard.sort((a, b) => b[1] - a[1]);

        return leaderboard; 
    }
    
}
