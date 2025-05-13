'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('permissions', [
    {
      name: 'view_users',
      status: true,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'edit_users',
      status: true,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'delete_users',
      status: false,
      createdBy: 'system',
      updatedBy: 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('permissions', null, {});
}
