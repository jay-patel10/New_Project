'use strict'

import bcrypt from 'bcrypt'

export async function up(queryInterface) {
  const hashedPassword1 = await bcrypt.hash('123', 10)
  const hashedPassword2 = await bcrypt.hash('123', 10)

  await queryInterface.bulkInsert('users', [
    {
      name: 'Alice Smith',
      email: 'alice@example.com',
      password: hashedPassword1,
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      password: hashedPassword2,
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {})
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('users', null, {})
}
