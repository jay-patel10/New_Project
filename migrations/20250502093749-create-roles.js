export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    role: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    status: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
}

export async function down(queryInterface) {
  await queryInterface.dropTable('roles')
}
