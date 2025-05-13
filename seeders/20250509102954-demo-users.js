'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('users', [
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'hashed_password_1',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'hashed_password_2',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', null, {});
}
