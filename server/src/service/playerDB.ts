import { PlayerModel } from '../db/player.db';
import { Player } from '../model/player.interface';  
import { PlayerService } from './player';
import { IPlayerService } from './player.interface';

export class PlayerDBService implements IPlayerService {

    // returns a copy of a specific player with the given id number
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

    // returns a deep copy of all existing players 
    async getPlayers() : Promise<Player[]> {

        const players = await PlayerModel.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })

        return players.map(player => player.get({ plain: true }) as Player);
    }


    // update player stats()
    // set player.last rating to the current round player ratings, set player.next rating to the next round player ratings,
    // calculate recent form (other method within this class) and seasonal form and update those attributes
}
