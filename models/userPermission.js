import { Model, DataTypes } from 'sequelize';

class UserPermission extends Model {
  static init(sequelize) {
    return super.init({
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users', // ✅ users table
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.JSON,
        allowNull: false,
        primaryKey: true,
        // No foreign key reference on JSON column
      },
    }, {
      sequelize,
      modelName: 'UserPermission',
      tableName: 'user_permissions',
      timestamps: false,
    });
  }
}

export default UserPermission;
