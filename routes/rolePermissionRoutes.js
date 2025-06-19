import express from 'express'
import { assignPermissionsToRole, removePermissionsFromRole } from '../controllers/rolePermissionController.js'

const router = express.Router()

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
 *               - roleId
 *               - permissionId
 *             properties:
 *               roleId:
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
router.post('/assign', assignPermissionsToRole)

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
 *               - roleId
 *               - permissionId
 *             properties:
 *               roleId:
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
router.post('/remove', removePermissionsFromRole)

export default router
