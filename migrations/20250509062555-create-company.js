export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Companies', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    companyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    companyAddress: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    taxNumber: Sequelize.STRING,
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
  await queryInterface.dropTable('Companies');
};
