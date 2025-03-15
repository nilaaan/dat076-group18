import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class TeamPlayers extends Model<InferAttributes<TeamPlayers>, InferCreationAttributes<TeamPlayers>> {
    declare team_id: number;
    declare player_id: number;
}


TeamPlayers.init(
    {
        team_id: {
            type: DataTypes.INTEGER,        // constraint >= 0
            primaryKey: true,
            /*references: {
                model: TeamModel,
                key: 'id'
            }*/
        },
        player_id: {
            type: DataTypes.INTEGER,         
            primaryKey: true,
            /*references: {
                model: PlayerModel,
                key: 'id'
            }*/
        }
    }, {
        sequelize: conn,
        modelName: 'teamPlayer'
});