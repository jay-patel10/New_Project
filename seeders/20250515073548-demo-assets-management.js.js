'use strict'

export const up = async (queryInterface) => {
  await queryInterface.bulkInsert('assets_management', [
    {
      assetTag: 'LAP-2025-001',
      serialNumber: 'SN-123456789',
      name: 'Dell XPS 15',
      description: 'High-performance laptop for developers',
      category: 'Laptop',
      location: 'Head Office - Mumbai',
      status: 'assigned',
      purchaseDate: '2023-06-15',
      warrantyExpiry: '2026-06-15',
      value: 150000,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      assetTag: 'MON-2025-002',
      serialNumber: 'SN-987654321',
      name: 'LG UltraWide',
      description: 'UltraWide monitor for multitasking',
      category: 'Monitor',
      location: 'Branch - Pune',
      status: 'Available',
      purchaseDate: '2024-01-20',
      warrantyExpiry: '2027-01-20',
      value: 45000,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      assetTag: 'PHN-2025-003',
      serialNumber: 'SN-456789123',
      name: 'iPhone 14',
      description: 'Mobile phone for management',
      category: 'Mobile',
      location: 'Head Office - Delhi',
      status: 'Assigned',
      purchaseDate: '2024-10-10',
      warrantyExpiry: '2026-10-10',
      value: 90000,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
}

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('assets_management', null, {})
}
