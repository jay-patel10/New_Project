'use strict';

export const up = async (queryInterface, Sequelize) => {
  await queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(150),
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    otp: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    otp_expires_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    verification_token: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    verification_deadline: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    is_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    login_token: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    login_token_expires_at: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    }
  });
};

export const down = async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('users');
};
