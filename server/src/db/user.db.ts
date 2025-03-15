import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, Association } from 'sequelize';
import { conn } from './conn';
import { TeamModel } from './team.db';

export class UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
    declare id: CreationOptional<number>;
    declare username: string;
    declare password: string;

   /* declare static associations: { 
        team: Association<UserModel, TeamModel>;
    }*/
}

UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,        // constraint >= 0
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,         
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize: conn,
        modelName: 'user'
});

//UserModel.hasOne(TeamModel, { sourceKey: "id", foreignKey: "user_id", as: "team" });

