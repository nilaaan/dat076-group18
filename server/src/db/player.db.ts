import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { ClubModel } from './club.db';

// change attributes and player model once database is set up
export class PlayerModel extends Model<InferAttributes<PlayerModel>, InferCreationAttributes<PlayerModel>> {
    declare id: number; // not optional because needs to be same as API olayer id 
    declare name: string;
    declare position: string;
    declare number: number;
    declare club: string;   // foreign key
    declare price: number;
    declare image: string; 
}

PlayerModel.init(
    {
        id: {
            type: DataTypes.BIGINT,         // constraint >= 0
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,         
            allowNull: false,
            unique: true
        },
        position: {
            type: DataTypes.STRING,         // constraint must be in (goalkeeper, defender, midfielder, forward)
            allowNull: false
        },
        number: {
            type: DataTypes.INTEGER,        // constraint > 0
            allowNull: false 
        },
        club: {
            type: DataTypes.STRING,         // foreign key
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,        // constraint >= 0
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,         // constraint must be a valid URL (if can with regex or smth)  
            allowNull: false,
            defaultValue: 'default_image.png'
        }           
        // last_rating: int, allowNull: true, and references rating in ratingModel
        // form: int, allowNull: true

    }, {
        sequelize: conn,
        modelName: 'player'
});
