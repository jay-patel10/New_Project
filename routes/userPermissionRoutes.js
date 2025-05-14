import express from 'express';
import { assignPermissionsToUser, removePermissionsFromUser } from '../controllers/userPermissionController.js';

const router = express.Router();

/**
 * @swagger
 * /api/user-permissions/assign:
 *   post:
 *     summary: Assign permissions to a user
 *     tags:
 *       - User Permissions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               permissionId:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Permissions assigned successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/assign', assignPermissionsToUser);

/**
 * @swagger
 * /api/user-permissions/remove:
 *   post:
 *     summary: Remove permissions from a user
 *     tags:
 *       - User Permissions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - permissionId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               permissionId:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3]
 *     responses:
 *       200:
 *         description: Permissions removed successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/remove', removePermissionsFromUser);

export default router;
