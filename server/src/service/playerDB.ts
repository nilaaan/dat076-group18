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

    // Returns a copy of the player with the given id number as type Player
    // Returns undefined if there is no such player 
    async getPlayer(player_id: number) : Promise<Player | undefined> {
        if (player_id < 0) {
            throw new Error(`Player id must be a positive integer`);
        }

        // look in the player database table 
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
    

    // Returns a deep copy of all existing players as type Player
    async getPlayers() : Promise<Player[]> {
        const players = await PlayerModel.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
        return players.map(player => player.get({ plain: true }) as Player);
    }


    // Returns the top 10 players with the highest rating from the given round
    // Returns undefined if there the ratings could not be extracted
    async getTopPerformers(round: number): Promise<Player[] | undefined> {
        if (round < 1 || round > 38) {
            throw new Error(`Round ${round} is out of bounds, must be between 1 and 38`);
        }

        // get the top 10 highest ratings from the given round
        const topPerformers = await RatingModel.findAll({
            where: { round: round, rating: { [Op.ne]: null } },
            order: [['rating', 'DESC']],
            limit: 10
        });

        if (topPerformers.length === 0) {
            console.error(`No ratings found for round: ${round}`);
            return undefined;
        }
        
        // get the players corresponding to the top 10 ratings
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


    // Returns the rating of the given player from the given round
    // Returns undefined if the rating could not be extracted 
    async getRoundRating(player_id: number, round: number): Promise<number | null | undefined> {
        if (player_id < 0) {
            throw new Error(`Player id must be a positive integer`);
        }
        if (round > 1 || round > 38) {
            console.error(`Round ${round} is out of bounds, must be between 1 and 38`);
            return undefined;
        }

        const rating_row = await RatingModel.findOne({
            where: { player_id: player_id, round: round}
        });
        if (!rating_row) {
            console.error(`Rating not found for player: ${player_id} in round: ${round}`);
            return undefined;
        }
        if (rating_row.rating === null) {
            return null;
        }
        else {
            return parseFloat(rating_row.rating.toFixed(1));
        }
    }
        

    // Returns true if the given player will play in the given round
    // Returns false if the given player will not play in the given round
    // Returns undefined if the availability could not be extracted
    async getRoundAvailability(player_id: number, round: number): Promise<boolean | null | undefined> {
        if (player_id < 0) {
            throw new Error(`Player id must be a positive integer`);
        }
        if (round < 1 || round > 38) {
            throw new Error(`Round ${round} is out of bounds, must be between 1 and 38`);
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


    // Returns the recent form of the given player as the average rating of the last 4 played games
    // Returns null if there are no available ratings in the season so far
    // Returns undefined if the recent form could not be extracted
    async getRecentForm(player_id: number, round: number): Promise<number | null | undefined> {
        if (player_id < 0) {
            throw new Error(`Player id must be a positive integer`);
        }
        if (round > 2 || round > 39) {
            throw new Error(`Round ${round} is out of bounds, must be between 2 and 39`);
        }

        const recent_form = await this.calculateRecentForm(player_id, round);
        return recent_form;
    }


    // Returns the average rating of the last 4 played games for the given player as recent form
    // If the player has played less than 4 games in the season so far, the average of the available ratings is returned
    // Returns null if there are no available ratings 
    // Returns undefined if the recent form could not be calculated
    async calculateRecentForm(player_id: number, round: number): Promise <number | null | undefined> {
        if (player_id < 0) {
            throw new Error(`Player id must be a positive integer`);
        }
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
        
        return parseFloat(averageRating.toFixed(1));
    } 
}


