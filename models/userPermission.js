import { Model, DataTypes } from 'sequelize'

class UserPermission extends Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        permissionId: {
          type: DataTypes.JSON,
          allowNull: false,
          primaryKey: true
        }
      },
      {
        sequelize,
        modelName: 'UserPermission',
        tableName: 'user_permissions',
        timestamps: false
      }
    )
  }
}

export default UserPermission
