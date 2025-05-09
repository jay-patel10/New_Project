export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('Customers', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    pin: Sequelize.STRING,
    social: Sequelize.STRING,
    contact: Sequelize.STRING,
    email: {
      type: Sequelize.STRING,
      validate: { isEmail: true },
    },
    status: {
      type: Sequelize.STRING,
      defaultValue: 'active',
    },
    description: Sequelize.TEXT,
    organization: Sequelize.STRING,
    leadSource: Sequelize.STRING,
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
  await queryInterface.dropTable('Customers');
};
