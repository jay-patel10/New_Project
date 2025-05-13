'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('customers', [
    {
      customerName: 'Alice Johnson',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      pin: '10001',
      social: '@alicejohnson',
      contact: '555-1234',
      email: 'alice@example.com',
      status: 'active',
      description: 'Lead from LinkedIn campaign',
      organization: 'ABC Corp',
      leadSource: 'LinkedIn',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      customerName: 'Raj Patel',
      city: 'Mumbai',
      state: 'MH',
      country: 'India',
      pin: '400001',
      social: '@rajpatel',
      contact: '9876543210',
      email: 'raj.patel@example.in',
      status: 'active',
      description: 'Walk-in client',
      organization: 'Patel Tech',
      leadSource: 'Referral',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      customerName: 'Emily Zhang',
      city: 'Beijing',
      state: 'BJ',
      country: 'China',
      pin: '100000',
      social: '@emilyzhang',
      contact: '13900000000',
      email: 'emily.z@example.cn',
      status: 'inactive',
      description: 'Former client, inactive for 1 year',
      organization: 'Zhang Solutions',
      leadSource: 'Website',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('customers', null, {});
}
