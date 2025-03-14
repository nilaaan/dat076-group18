import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association } from 'sequelize';
import { conn } from './conn';
import { PlayerModel } from './player.db';

export class ClubModel extends Model<InferAttributes<ClubModel>, InferCreationAttributes<ClubModel>> {
    declare id: number; 
    declare name: string; 
    /*declare static associations: {
        players: Association<ClubModel, PlayerModel>;
    }*/
}

ClubModel.init(
    {
        id: {
            type: DataTypes.INTEGER,        // constraint >= 0
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,         
            allowNull: false,
            unique: true,
        }
    }, {
        sequelize: conn,
        modelName: 'club'
});

//ClubModel.hasMany(PlayerModel, { sourceKey: "name", foreignKey: "club", as: "players" });