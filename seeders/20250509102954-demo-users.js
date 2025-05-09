'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('users', [
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: 'hashed_password_1',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: 'hashed_password_2',
      is_verified: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('users', null, {});
}
