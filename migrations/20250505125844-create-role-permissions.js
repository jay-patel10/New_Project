'use strict'

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', { // Change table name to camelCase
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      permissionId: {
        type: Sequelize.JSON,
        allowNull: false
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('role_permissions') // Change table name to camelCase
  }
}
