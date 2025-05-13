'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_permissions', {
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // Removed the references block
      },
      permissionId: {
        type: Sequelize.JSON,
        allowNull: false,
        // No foreign key reference or indexing on JSON
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_permissions');
  },
};
