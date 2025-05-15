'use strict';

export const up = async (queryInterface) => {
  await queryInterface.bulkInsert('assets_management', [
    {
      assetTag: 'LAP-2025-001',
      assetType: 'Laptop',
      assetName: 'Dell XPS 15',
      serialNumber: 'SN-123456789',
      status: 'In Use',
      purchaseDate: '2023-06-15',
      warrantyExpiry: '2026-06-15',
      location: 'Head Office - Mumbai',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      assetTag: 'MON-2025-002',
      assetType: 'Monitor',
      assetName: 'LG UltraWide',
      serialNumber: 'SN-987654321',
      status: 'Available',
      purchaseDate: '2024-01-20',
      warrantyExpiry: '2027-01-20',
      location: 'Branch - Pune',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      assetTag: 'PHN-2025-003',
      assetType: 'Mobile',
      assetName: 'iPhone 14',
      serialNumber: 'SN-456789123',
      status: 'Assigned',
      purchaseDate: '2024-10-10',
      warrantyExpiry: '2026-10-10',
      location: 'Head Office - Delhi',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
};

export const down = async (queryInterface) => {
  await queryInterface.bulkDelete('assets_management', null, {});
};
