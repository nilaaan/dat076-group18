import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class User_session extends Model<InferAttributes<User_session>, InferCreationAttributes<User_session>> { 
    declare user_id: number; 
    declare game_id: number;
}


User_session.init(
    {
        user_id: {
            type: DataTypes.BIGINT,         // constraint >= 0, references id in User Model  
            primaryKey: true,
        },
        game_id: {
            type: DataTypes.BIGINT,        // constraint >= 0, references id in Game_session Model
            primaryKey: true,
        }
    }, {
        sequelize: conn,
        modelName: 'user_session'
});