import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes, ForeignKey } from 'sequelize';
import { conn } from './conn';
import { UserModel } from './user.db';

export class TeamModel extends Model<InferAttributes<TeamModel>, InferCreationAttributes<TeamModel>> {
    declare id: CreationOptional<number>;
    declare user_id: number; 
    declare balance: number;
    declare points: number; 
}


TeamModel.init(
    {
        id: {
            type: DataTypes.BIGINT,        // constraint >= 0
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,         
            allowNull: false,
            /*references: {
                model: UserModel,
                key: 'id'
            }*/
        },
        balance: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        points: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        sequelize: conn,
        modelName: 'team'
});
