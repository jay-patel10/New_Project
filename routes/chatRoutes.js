import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import {
  sendMessage,
  getMessagesBetweenUsers,
  getChatUsers,
  deleteMessage
} from '../controllers/chatController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat messaging between users
 */

/**
 * @swagger
 * /api/chats:
 *   post:
 *     summary: Send a chat message
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipientId
 *               - message
 *             properties:
 *               recipientId:
 *                 type: integer
 *                 description: ID of the user receiving the message
 *               message:
 *                 type: string
 *                 description: Message content
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', verifyToken, sendMessage)

/**
 * @swagger
 * /api/chats/{userId}:
 *   get:
 *     summary: Get all messages between the current user and another user
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the other user in the conversation
 *     responses:
 *       200:
 *         description: List of chat messages
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:userId', verifyToken, getMessagesBetweenUsers)

/**
 * @swagger
 * /api/chats/users/list:
 *   get:
 *     summary: Get all users the current user has chatted with
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user IDs the current user has chatted with
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/users/list', verifyToken, getChatUsers)

/**
 * @swagger
 * /api/chats/delete:
 *   delete:
 *     summary: Delete a chat message using UUID from request body
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uuid
 *             properties:
 *               uuid:
 *                 type: string
 *                 format: uuid
 *                 description: UUID of the message to delete
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       400:
 *         description: UUID is required in body
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete', deleteMessage) // changed from `/:id` to `/delete`

export default router
