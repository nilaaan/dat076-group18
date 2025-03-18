import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';
import { UserModel } from './user.db';
import { Game_sessionModel } from './game_session.db';


export class User_games extends Model<InferAttributes<User_games>, InferCreationAttributes<User_games>> { 
    declare user_id: number; 
    declare game_id: number;
    declare current_round: number;
    // declare points: number   (if we want to enable multiple games per user)
}


User_games.init(
    {
        user_id: {
            type: DataTypes.INTEGER,          
            primaryKey: true,
            validate: {
                min: 0, // Ensure user_id is >= 0
            },
            references: {
                model: UserModel, // References id in User Model
                key: 'id'
            }
        },
        game_id: {
            type: DataTypes.INTEGER, // References id in game_session Model
            primaryKey: true,
            validate: {
                min: 0, // Ensure game_id is >= 0
            },
            references: {
                model: Game_sessionModel, // References id in User Model
                key: 'id'
            }
        },
        current_round: {
            type: DataTypes.INTEGER,        
            allowNull: false,
            validate: {
                min: 1, // Ensure 0 <= current_round <= 39
                max: 39
            },
        }

    },
    {
        sequelize: conn,
        modelName: 'user_game'
    }
);