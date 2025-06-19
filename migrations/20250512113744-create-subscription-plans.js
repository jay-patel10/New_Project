'use strict'

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('subscription_plans', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false
    },
    durationInDays: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    features: {
      type: Sequelize.JSON,
      allowNull: true
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  })
}

export const down = async (queryInterface) => {
  await queryInterface.dropTable('subscription_plans')
}
