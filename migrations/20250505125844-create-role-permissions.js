'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', {
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'permissions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    // Optionally add a composite primary key or unique constraint
    await queryInterface.addConstraint('role_permissions', {
      fields: ['role_id', 'permission_id'],
      type: 'primary key',
      name: 'pk_role_permission',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('role_permissions');
  },
};
