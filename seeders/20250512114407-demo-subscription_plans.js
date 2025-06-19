'use strict'

export async function up(queryInterface) {
  await queryInterface.bulkInsert('subscription_plans', [
    {
      name: 'Basic Plan',
      price: 9.99,
      durationInDays: 30,
      description: 'Basic monthly subscription plan',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Pro Plan',
      price: 24.99,
      durationInDays: 90,
      description: 'Quarterly subscription with more features',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Enterprise Plan',
      price: 89.99,
      durationInDays: 365,
      description: 'Annual subscription for businesses',
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete('subscription_plans', null, {})
}
