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



    async getTopPerformers(round: number): Promise<Player[] | undefined> {
        const topPerformers = await RatingModel.findAll({
            where: { round: round, rating: { [Op.ne]: null } },
            order: [['rating', 'DESC']],
            limit: 10
        });

        if (topPerformers.length === 0) {
            console.error(`No ratings found for round: ${round}`);
            return undefined;
        }

        const playerIds = topPerformers.map(rating_row => rating_row.player_id);
        const players = await PlayerModel.findAll({
            where: { id: playerIds },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });

        if (players.length === 0) {
            console.error(`No players found with the given ids: ${playerIds}`);
            return undefined;
        }

        const top_perfomers : Player[] = players.map(player => player.get({ plain: true }) as Player); 

        return top_perfomers;
    }



    async getRoundRating(player_id: number, round: number): Promise<number | null | undefined> {
        if (round < 1) {
            return null; 
        }
        if (round > 38) {
            console.error(`Round ${round} is out of bounds`);
            return undefined;
        }

        const rating_row = await RatingModel.findOne({
            where: { player_id: player_id, round: round}
        });
        if (!rating_row) {
            console.error(`Rating not found for player: ${player_id} in round: ${round}`);
            return undefined;
        }
        return rating_row.rating;
    }
    


    async getRoundAvailability(player_id: number, round: number): Promise<boolean | null | undefined> {
        if (round < 1) {
            return null; 
        }
        if (round > 38) {
            console.error(`Round ${round} is out of bounds`);
            return undefined;
        }
        const rating = await this.getRoundRating(player_id, round);

        if (rating === undefined) {
            console.error(`Rating not found for player: ${player_id} in round: ${round}`);
            return undefined;
        }

        if (rating === null) {
            return false;
        }
        return true;
    }


    async getRecentForm(player_id: number, round: number): Promise<number | null | undefined> {
        if (round <= 1) {
            return null;
        }
        if (round > 39) {
            console.error(`Round ${round} is out of bounds`);
            return undefined;
        }

        const recent_form = await this.calculateRecentForm(player_id, round);
        return recent_form;
    }


    // returns the average rating of the last 4 played games pf the given player as recent form
    async calculateRecentForm(player_id: number, round: number): Promise <number | null | undefined> {
        const ratings = await RatingModel.findAll({
            where: {
                player_id: player_id,
                round: {
                    [Op.lt]: round // Less than the given round
                }
            },
            order: [['round', 'DESC']]
        });
        
        if (ratings.length === 0) {
            console.error(`No ratings found for player: ${player_id}`);
            return undefined; 
        }
        
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


