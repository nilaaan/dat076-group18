import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class Game_sessionModel extends Model<InferAttributes<Game_sessionModel>, InferCreationAttributes<Game_sessionModel>> {
    declare id: CreationOptional<number>;
    declare start_date: Date; 
    declare current_round: number;
}


Game_sessionModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,        
            primaryKey: true,
            validate: {
                min: 0, // Ensures id is >= 0
            }
        },
        start_date: {
            type: DataTypes.DATE,         
            allowNull: false,
        },
        current_round: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1, // constraint: value in (1-39)
                max: 39
            }
        }
    },
    {
        sequelize: conn,
        modelName: 'game_session'
    }
);