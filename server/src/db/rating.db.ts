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
            type: DataTypes.INTEGER,        // constraint >= 0 and references id in playerModel
            primaryKey: true,
        },
        round: {
            type: DataTypes.INTEGER,       // constraint has to be in (1-38)
            primaryKey: true,
        },
        rating: {
            type: DataTypes.FLOAT,       // constraint >= 0 
            allowNull: true
        }
    }, {
        sequelize: conn,
        modelName: 'rating'
});

