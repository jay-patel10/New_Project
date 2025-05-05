// models/rolePermission.js
export default (sequelize, DataTypes) => {
    const RolePermission = sequelize.define('RolePermission', {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    }, {
      tableName: 'role_permissions',
      timestamps: false,
    });
  
    return RolePermission;
  };
  