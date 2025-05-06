import { Model, DataTypes } from 'sequelize';

class RolePermission extends Model {
  static init(sequelize) {
    return super.init({
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles', // ✅ table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.JSON,
        allowNull: false,
        references: {
          model: 'permissions', // ✅ table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    }, {
      sequelize,
      modelName: 'RolePermission',
      tableName: 'role_permissions',
      timestamps: false,
    });
  }
}

export default RolePermission;
