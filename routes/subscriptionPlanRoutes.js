import express from 'express';
import {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from '../controllers/subscriptionPlanController.js';

const router = express.Router();

/**
 * @swagger
 * /api/subscription-plans:
 *   post:
 *     summary: Create a new subscription plan
 *     tags:
 *       - Subscription Plans
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - durationInDays
 *             properties:
 *               name:
 *                 type: string
 *                 example: Premium Plan
 *               description:
 *                 type: string
 *                 example: A premium subscription plan with full features
 *               price:
 *                 type: number
 *                 example: 199.99
 *               isActive:
 *                 type: boolean
 *                 example: true
 *               durationInDays:
 *                 type: integer
 *                 example: 30
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Feature A", "Feature B"]
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', createSubscriptionPlan);

/**
 * @swagger
 * /api/subscription-plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags:
 *       - Subscription Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of subscription plans
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllSubscriptionPlans);

/**
 * @swagger
 * /api/subscription-plans/{id}:
 *   get:
 *     summary: Get a subscription plan by ID
 *     tags:
 *       - Subscription Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Subscription plan details
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getSubscriptionPlanById);

/**
 * @swagger
 * /api/subscription-plans/{id}:
 *   put:
 *     summary: Update a subscription plan by ID
 *     tags:
 *       - Subscription Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               isActive:
 *                 type: boolean
 *               durationInDays:
 *                 type: integer
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateSubscriptionPlan);

/**
 * @swagger
 * /api/subscription-plans/{id}:
 *   delete:
 *     summary: Delete a subscription plan by ID
 *     tags:
 *       - Subscription Plans
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', deleteSubscriptionPlan);

export default router;
