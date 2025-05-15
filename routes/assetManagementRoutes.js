import express from 'express';
import {
  createAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from '../controllers/assetManagementController.js';

const router = express.Router();

/**
 * @swagger
 * /api/asset-management:
 *   post:
 *     summary: Create a new asset
 *     tags:
 *       - Asset Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetTag
 *               - name
 *               - status
 *             properties:
 *               assetTag:
 *                 type: string
 *                 example: LAP-2025-001
 *               serialNumber:
 *                 type: string
 *                 example: SN-123456789
 *               name:
 *                 type: string
 *                 example: Dell XPS 15
 *               description:
 *                 type: string
 *                 example: High performance laptop for dev team
 *               category:
 *                 type: string
 *                 example: Laptop
 *               location:
 *                 type: string
 *                 example: Head Office - Mumbai
 *               status:
 *                 type: string
 *                 enum: [available, assigned, in_repair, retired]
 *                 example: available
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-06-15
 *               warrantyExpiry:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-15
 *               value:
 *                 type: number
 *                 example: 1500.5
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/', createAsset);

/**
 * @swagger
 * /api/asset-management/getAllAssets:
 *   post:
 *     summary: Get all assets (paginated)
 *     tags: [AssetManagement]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:
 *                 type: integer
 *                 default: 1
 *               limit:
 *                 type: integer
 *                 default: 10
 *     responses:
 *       200:
 *         description: Paginated list of assets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AssetManagement'
 */
router.post('/getAllAssets', getAllAssets);

/**
 * @swagger
 * /api/asset-management/{id}:
 *   get:
 *     summary: Get asset by ID
 *     tags:
 *       - Asset Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset details
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getAssetById);

/**
 * @swagger
 * /api/asset-management/{id}:
 *   put:
 *     summary: Update asset by ID
 *     tags:
 *       - Asset Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assetTag:
 *                 type: string
 *                 example: LAP-2025-001
 *               serialNumber:
 *                 type: string
 *                 example: SN-123456789
 *               name:
 *                 type: string
 *                 example: Dell XPS 15
 *               description:
 *                 type: string
 *                 example: Updated description here
 *               category:
 *                 type: string
 *                 example: Laptop
 *               location:
 *                 type: string
 *                 example: Head Office - Mumbai
 *               status:
 *                 type: string
 *                 enum: [available, assigned, in_repair, retired]
 *                 example: assigned
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-06-15
 *               warrantyExpiry:
 *                 type: string
 *                 format: date
 *                 example: 2026-06-15
 *               value:
 *                 type: number
 *                 example: 1500.5
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateAsset);

/**
 * @swagger
 * /api/asset-management/{id}:
 *   delete:
 *     summary: Delete asset by ID
 *     tags:
 *       - Asset Management
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Asset ID
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteAsset);

export default router;
