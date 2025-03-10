import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class Game_session extends Model<InferAttributes<Game_session>, InferCreationAttributes<Game_session>> {
    declare id: CreationOptional<number>;
    declare start_date: Date; 
    declare current_round: number;
}


Game_session.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,        
            primaryKey: true,
        },
        start_date: {
            type: DataTypes.DATE,         
            primaryKey: true,
        },
        current_round: {
            type: DataTypes.INTEGER,        // constraint: value in (1-38)
            allowNull: false,
        }

    }, {
        sequelize: conn,
        modelName: 'game_session'
});