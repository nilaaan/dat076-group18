import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { ClubModel } from './club.db';

// change attributes and player model once database is set up
export class PlayerModel extends Model<InferAttributes<PlayerModel>, InferCreationAttributes<PlayerModel>> {
    declare id: number; // not optional because needs to be same as API player id 
    declare name: string;
    declare position: string;
    declare number: number;
    declare club: string;   // foreign key
    declare price: number;
    declare image: string; 
    declare last_rating: number | null;    // foreign key, references rating in ratingModel
    declare next_rating: number | null;    // foreign key, references rating in ratingModel
    declare form: number | null;           
}

PlayerModel.init(
    {
        id: {
            type: DataTypes.INTEGER,         // constraint >= 0
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
            defaultValue: 'default_image.png'   // add some generic player image (??)
        },
        last_rating: {
            type: DataTypes.FLOAT,        // foreign key, references rating in ratingModel
            allowNull: true,
            defaultValue: null
        },
        next_rating: {
            type: DataTypes.FLOAT,        // foreign key, references rating in ratingModel
            allowNull: true,
            defaultValue: null
        }, 
        form: {
            type: DataTypes.FLOAT,        // constraint >= 0
            allowNull: true,
            defaultValue: null
        }           

    }, {
        sequelize: conn,
        modelName: 'player'
});
