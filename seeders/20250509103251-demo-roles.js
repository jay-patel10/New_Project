'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('roles', [
    {
      role: 'Admin',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'Editor',
      status: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      role: 'Viewer',
      status: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {});
}
