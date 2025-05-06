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
        type: Sequelize.JSON,
        allowNull: false,
        // ❌ No foreign key reference or indexing on JSON
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('role_permissions');
  },
};
