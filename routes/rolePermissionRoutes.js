import express from 'express';
import { assignPermissionsToRole, removePermissionsFromRole } from '../controllers/rolePermissionController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * @swagger
 * /api/role-permissions/assign:
 *   post:
 *     summary: Assign permissions to a role
 *     tags:
 *       - Role Permissions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - permission_ids
 *             properties:
 *               role_id:
 *                 type: integer
 *                 example: 1
 *               permission_ids:
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
router.post('/assign', verifyToken, assignPermissionsToRole);

/**
 * @swagger
 * /api/role-permissions/remove:
 *   post:
 *     summary: Remove permissions from a role
 *     tags:
 *       - Role Permissions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - permission_ids
 *             properties:
 *               role_id:
 *                 type: integer
 *                 example: 1
 *               permission_ids:
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
router.post('/remove', verifyToken, removePermissionsFromRole);

export default router;
