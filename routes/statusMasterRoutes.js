import express from 'express';
import {
  createStatusMaster,
  getStatusMasterById,
  updateStatusMaster,
  deleteStatusMaster,
  getAllStatusMasters,
} from '../controllers/statusMasterController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: StatusMasters
 *   description: Status Master management
 */

/**
 * @swagger
 * /api/status-masters:
 *   post:
 *     summary: Create a new status master
 *     tags: [StatusMasters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status Master created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createStatusMaster);

/**
 * @swagger
 * /api/status-masters/getAllStatusMasters:
 *   post:
 *     summary: Get all status masters (paginated)
 *     tags: [StatusMasters]
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
 *         description: Paginated list of status masters
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
 *                     $ref: '#/components/schemas/StatusMaster'
 */
router.post('/getAllStatusMasters', getAllStatusMasters);

/**
 * @swagger
 * /api/status-masters/{id}:
 *   get:
 *     summary: Get a status master by ID
 *     tags: [StatusMasters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status Master found
 *       404:
 *         description: Status Master not found
 */
router.get('/:id', getStatusMasterById);

/**
 * @swagger
 * /api/status-masters/{id}:
 *   put:
 *     summary: Update a status master
 *     tags: [StatusMasters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status Master updated
 *       404:
 *         description: Status Master not found
 */
router.put('/:id', updateStatusMaster);

/**
 * @swagger
 * /api/status-masters/{id}:
 *   delete:
 *     summary: Delete a status master
 *     tags: [StatusMasters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status Master deleted
 *       404:
 *         description: Status Master not found
 */
router.delete('/:id', deleteStatusMaster);

export default router;
