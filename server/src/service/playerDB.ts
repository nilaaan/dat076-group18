import { Op } from 'sequelize';
import { PlayerModel } from '../db/player.db';
import { RatingModel } from '../db/rating.db';
import { Player } from '../model/player.interface';  
import { PlayerService } from './player';
import { IPlayerService } from './player.interface';

export class PlayerDBService implements IPlayerService {

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


    async updatePlayerStats(round: number): Promise<void> {
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
            }

            const recentForm = await this.obtainRecentForm(player.id, nextRound);
            await player.update({ form: recentForm });
        }
    }
    // set player.last rating to the current round player ratings, set player.next rating to the next round player ratings,
    // calculate recent form (other method within this class) and seasonal form and update those attributes


    // isPlayerAvailable() called in buy/sell methods of TeamDB (and frontend) to check if existing teamPlayer is unavailable next match 
    
    // returns the average rating of the last 4 played games pf the given player as recent form
    async obtainRecentForm(player_id: number, round: number): Promise <number | null> {
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


