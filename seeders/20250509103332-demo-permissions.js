'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('permissions', [
    {
      name: 'view_users',
      status: true,
      created_by: 'system',
      updated_by: 'system',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'edit_users',
      status: true,
      created_by: 'system',
      updated_by: 'system',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'delete_users',
      status: false,
      created_by: 'system',
      updated_by: 'system',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('permissions', null, {});
}
