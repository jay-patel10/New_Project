'use strict'

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(150),
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    otp: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    otpExpiresAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    verificationToken: {
      type: Sequelize.STRING(255),
      allowNull: true
    },
    verificationDeadline: {
      type: Sequelize.DATE,
      allowNull: true
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    loginToken: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    loginTokenExpiresAt: {
      type: Sequelize.DATE,
      allowNull: true
    },
    companyId: {
      type: Sequelize.INTEGER,
      allowNull: true
      // references intentionally omitted as noted
    },
    subscriptionPlanId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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
  await queryInterface.dropTable('users')
}
