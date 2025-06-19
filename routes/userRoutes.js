import express from 'express'
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
  subscribeUser,
  unsubscribeUser
} from '../controllers/userController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               subscriptionPlanId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', createUser)

/**
 * @swagger
 * /api/users/getAllUsers:
 *   post:
 *     summary: Get all users (paginated)
 *     tags: [Users]
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
 *         description: Paginated list of users
 */
router.post('/getAllUsers', getAllUsers)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', getUserById)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               subscriptionPlanId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.put('/:id', updateUser)

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/:id', deleteUser)

/**
 * @swagger
 * /api/users/subscribe:
 *   post:
 *     summary: Subscribe user to a plan
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user to subscribe
 *                 example: 1
 *               subscriptionPlanId:
 *                 type: integer
 *                 description: ID of the subscription plan to assign
 *                 example: 1
 *     responses:
 *       200:
 *         description: User subscribed to plan successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User subscribed to plan successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: john.doe@gmail.com
 *                     companyId:
 *                       type: integer
 *                       example: 1
 *                     subscriptionPlanId:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-14T07:21:02.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-14T07:21:02.000Z"
 *       400:
 *         description: Missing userId or subscriptionPlanId or invalid input
 *       404:
 *         description: User or plan not found
 *       500:
 *         description: Internal server error
 */
router.post('/subscribe', subscribeUser)

/**
 * @swagger
 * /api/users/{id}/unsubscribe:
 *   delete:
 *     summary: Unsubscribe user from plan
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User unsubscribed
 *       404:
 *         description: User not found
 */
router.delete('/:id/unsubscribe', unsubscribeUser)

export default router
