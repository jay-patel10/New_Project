export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('status_masters', {  // Use camelCase for the table name
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'active',
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
};

export const down = async (queryInterface) => {
  await queryInterface.dropTable('status_masters');  // Use camelCase for the table name
};
