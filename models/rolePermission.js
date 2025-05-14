import { Model, DataTypes } from 'sequelize';

class RolePermission extends Model {
  static init(sequelize) {
    return super.init({
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'roles', // ✅ table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permissionId: {
        type: DataTypes.JSON,
        allowNull: false,
        primaryKey: true,
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
