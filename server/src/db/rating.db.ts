import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';
import { PlayerModel } from './player.db';


export class Ratings extends Model<InferAttributes<Ratings>, InferCreationAttributes<Ratings>> {
    declare player_id: number;
    declare round: number; 
    declare rating: number;
}

Ratings.init(
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
            type: DataTypes.INTEGER,       // constraint >= 0 
            allowNull: true
        }
    }, {
        sequelize: conn,
        modelName: 'rating'
});