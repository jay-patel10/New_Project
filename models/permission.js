import { Model, DataTypes } from 'sequelize';

class Permission extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
        createdBy: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        updatedBy: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'Permission',
        tableName: 'permissions',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      }
    );
  }
}

export default Permission;
