'use strict'

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('assets_management', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assetTag: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    serialNumber: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    category: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    location: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    status: {
      type: Sequelize.ENUM('available', 'assigned', 'in_repair', 'retired'),
      allowNull: false,
      defaultValue: 'available'
    },
    purchaseDate: {
      type: Sequelize.DATE,
      allowNull: true
    },
    warrantyExpiry: {
      type: Sequelize.DATE,
      allowNull: true
    },
    value: {
      type: Sequelize.FLOAT,
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
  await queryInterface.dropTable('assets_management')
}
