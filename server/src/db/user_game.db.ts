import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class User_games extends Model<InferAttributes<User_games>, InferCreationAttributes<User_games>> { 
    declare user_id: number; 
    declare game_id: number;
    declare current_round: number;
    // declare points: number   (if we want to enable multiple games per user)
}


User_games.init(
    {
        user_id: {
            type: DataTypes.INTEGER,         // constraint >= 0, references id in User Model  
            primaryKey: true,
        },
        game_id: {
            type: DataTypes.INTEGER,        // constraint >= 0, references id in Game_session Model
            primaryKey: true,
        },
        current_round: {
            type: DataTypes.INTEGER,        // constraint: value in (1-38)
            allowNull: false,
        }

    }, {
        sequelize: conn,
        modelName: 'user_game'
});