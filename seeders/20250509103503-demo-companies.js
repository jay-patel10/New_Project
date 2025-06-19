'use strict'

export async function up(queryInterface) {
  await queryInterface.bulkInsert('companies', [
    {
      companyName: 'TechNova Inc.',
      companyAddress: '123 Innovation Blvd',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      taxNumber: 'TX12345678',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      companyName: 'GreenField Solutions',
      companyAddress: '456 Eco Way',
      city: 'Portland',
      state: 'OR',
      country: 'USA',
      taxNumber: 'TX87654321',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      companyName: 'SkyNet Global',
      companyAddress: '789 AI Street',
      city: 'Austin',
      state: 'TX',
      country: 'USA',
      taxNumber: 'TX99887766',
      status: 'inactive',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('companies', null, {})
}
