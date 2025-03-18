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
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: TeamModel,
                key: 'id'
            },
            validate: {
                min: 0, // Ensures id is >= 0
            },
        },
        player_id: {
            type: DataTypes.INTEGER,         
            primaryKey: true,
            references: {
                model: PlayerModel,
                key: 'id'
            },
            validate: {
                min: 0, // Ensures id is >= 0
            },
        }
    }, {
        sequelize: conn,
        modelName: 'teamPlayer'
});