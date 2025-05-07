'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_permissions', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: Sequelize.JSON,
        allowNull: false,
        // No foreign key reference — JSON columns don't support it
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_permissions');
  },
};
