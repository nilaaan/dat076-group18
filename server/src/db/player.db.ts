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
}

PlayerModel.init(
    {
        id: {
            type: DataTypes.INTEGER,         // constraint >= 0
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,         
            allowNull: false
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // Must be either Goalkeeper, Defender, Midfielder or Forward
                isIn: [[ 'Attacker', 'Midfielder', 'Defender', 'Goalkeeper' ]]
            }
        },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false, 
            validate: {
                min: 0, // Ensures number is >= 0
            }
        },
        club: {
            type: DataTypes.STRING,         
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0, // Ensures price is >= 0
            }
        },
        image: {
            type: DataTypes.STRING,         
            allowNull: false,
            defaultValue: 'default_image.png'   // add some generic player image (??)
        }        
    },
    {
        sequelize: conn,
        modelName: 'player'
    }
);
