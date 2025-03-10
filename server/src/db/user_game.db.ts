import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class User_game extends Model<InferAttributes<User_game>, InferCreationAttributes<User_game>> { 
    declare user_id: number; 
    declare game_id: number;
}


User_game.init(
    {
        user_id: {
            type: DataTypes.INTEGER,         // constraint >= 0, references id in User Model  
            primaryKey: true,
        },
        game_id: {
            type: DataTypes.INTEGER,        // constraint >= 0, references id in Game_session Model
            primaryKey: true,
        }
    }, {
        sequelize: conn,
        modelName: 'user_game'
});