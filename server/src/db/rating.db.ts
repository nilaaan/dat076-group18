import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class RatingModel extends Model<InferAttributes<RatingModel>, InferCreationAttributes<RatingModel>> {
    declare player_id: number;
    declare round: number; 
    declare rating: number | null;
}

RatingModel.init(
    {
        player_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            validate: {
                min: 0, // Ensures id is >= 0
            },
            references: {
                model: PlayerModel, // References PlayerModel
                key: 'id', // PlayerModel's primary key
            },
        },
        round: {
            type: DataTypes.INTEGER,       
            primaryKey: true,
            validate: {
                min: 1, // Ensures 1 <= round <= 38 
                max: 38
            },
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0, // Ensures rating is between 0 and 10
                max: 10
            },
        }
    }, {
        sequelize: conn,
        modelName: 'rating'
});

