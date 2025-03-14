import { PlayerModel } from '../db/player.db';
import { Player } from '../model/player.interface';  
import { PlayerService } from './player';
import { IPlayerService } from './player.interface';

export class PlayerDBService implements IPlayerService {

    // returns a copy of a specific player with the given id number
    // returns undefined if there is no such player 
    async getPlayer(id: number) : Promise<Player | undefined> {

        const player = await PlayerModel.findOne({
            where: {id : id},
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        }); 

        if (! player) {
            console.error(`Player not found: ${id}`);
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
}
