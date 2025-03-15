import { Op } from 'sequelize';
import { PlayerModel } from '../db/player.db';
import { RatingModel } from '../db/rating.db';
import { Player } from '../model/player.interface';  
import { PlayerService } from './player';
import { IPlayerService } from './player.interface';
import { GameSessionService } from './game_session';
import { IGameSessionService } from './game_session.interface';

export class PlayerDBService implements IPlayerService {
    private gamesessionService;

    constructor(gamesessionService : IGameSessionService) {
        this.gamesessionService = gamesessionService;
    }

    // returns a copy of a specific player with the given id number as type Player
    // returns undefined if there is no such player 
    async getPlayer(player_id: number) : Promise<Player | undefined> {

        const player = await PlayerModel.findOne({
            where: {id : player_id},
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        }); 

        if (! player) {
            console.error(`Player not found: ${player_id}`);
            return undefined
        }
        return player.get({plain: true}) as Player;
    }
    

    // returns a deep copy of all existing players as type Player
    async getPlayers() : Promise<Player[]> {

        const players = await PlayerModel.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
        return players.map(player => player.get({ plain: true }) as Player);
    }


    ///// CHANGE // REMOVE COMPLETELY 
   /* async updatePlayerStats(round: number): Promise<boolean | undefined> {
        const players = await PlayerModel.findAll();

        for (const player of players) {
            await player.update({ last_rating: player.next_rating });

            const nextRound = round + 1; 
            const rating = await RatingModel.findOne({      // move query to other class
                where: { player_id: player.id, round: nextRound }
            });

            if (rating) {
                await player.update({ next_rating: rating.rating });
            } else {
                console.error(`Rating not found for player: ${player.id} in round: ${nextRound}`);
                return undefined;
            }

            const recentForm = await this.obtainRecentForm(player.id, nextRound);
            
            await player.update({ form: recentForm });
        }
        return true; 
    }*/
    // set player.last rating to the current round player ratings, set player.next rating to the next round player ratings,
    // calculate recent form (other method within this class) and seasonal form and update those attributes


    // isPlayerAvailable() called in buy/sell methods of TeamDB (and frontend) to check if existing teamPlayer is unavailable next match 
    
    async getLastMatchRating(player_id: number, username: string): Promise<number | null | undefined> {

        const isGameSession = await this.gamesessionService.getUserRound(username);
        if (!isGameSession) {
            return null; 
        }

        const current_round = await this.gamesessionService.getUserRound(username);

        if (!current_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        const last_round = current_round - 1;
        if (last_round >= 1) {
            const rating_row = await RatingModel.findOne({
                where: { player_id: player_id, round: last_round}
            });
            if (!rating_row) {
                console.error(`Rating not found for player: ${player_id} in round: ${last_round}`);
                return undefined;
            }
            return rating_row.rating;
        }
        else {
            return null;
        }
    }


    async getNextMatchAvailability(player_id: number, username: string): Promise<boolean | null | undefined> {
        const isGameSession = await this.gamesessionService.isGameSession(username);
        if (!isGameSession) {
            return null;
        }

        const current_round = await this.gamesessionService.getUserRound(username);

        if (!current_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        const rating_row = await RatingModel.findOne({
            where: { player_id: player_id, round: current_round }
        });

        if (!rating_row) {
            console.error(`Rating not found for player: ${player_id} in round: ${current_round - 1}`);
            return undefined;
        }

        if (rating_row.rating === null) {
            return false;
        }
        return true;
    }


    async getRecentForm(player_id: number, username: string): Promise<number | null | undefined> {
        const isGameSession = await this.gamesessionService.isGameSession(username);
        if (!isGameSession) {
            return null;
        }

        const current_round = await this.gamesessionService.getUserRound(username);
        
        if (!current_round) {
            console.error(`User ${username} does not have a game session`);
            return undefined;
        }
        const recent_form = await this.calculateRecentForm(player_id, current_round);
        return recent_form;
    }


    // returns the average rating of the last 4 played games pf the given player as recent form
    async calculateRecentForm(player_id: number, round: number): Promise <number | null> {
        const ratings = await RatingModel.findAll({
            where: {
                player_id: player_id,
                round: {
                    [Op.lt]: round // Less than the given round
                }
            },
            order: [['round', 'DESC']]
        });
        
        // get the last (max 4) available ratings of the player in the season so far
        const nonNullRatings = ratings
            .map(rating => rating.rating)
            .filter(rating => rating !== null)
            .slice(0, 4); // Take the first 4 non-null ratings

        // return null if there are no available ratings in the season so far
        console.log("nonNullRatings: " + nonNullRatings);
        if (nonNullRatings.length === 0) {
            return null;
        }
        // calculate the average of the available ratings obtained 
        let sum : number = 0;  
        for (const rating of nonNullRatings) {
            sum += rating; 
        }
        const averageRating = sum / nonNullRatings.length;
        
        return averageRating;
    } 
}


