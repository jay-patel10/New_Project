// routes/index.js
import express from 'express'

import authRoutes from './authRoutes.js'
import roleRoutes from './roleRoutes.js'
import permissionRoutes from './permissionRoutes.js'
import rolePermissionRoutes from './rolePermissionRoutes.js'
import userPermissionRoutes from './userPermissionRoutes.js'
import userRoutes from './userRoutes.js'
import companyRoutes from './companyRoutes.js'
import customerRoutes from './customerRoutes.js'
import statusMasterRoutes from './statusMasterRoutes.js'
import subscriptionPlansRoutes from './subscriptionPlanRoutes.js'
import assetManagementRoutes from './assetManagementRoutes.js'
import chatRoutes from './chatRoutes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/roles', roleRoutes)
router.use('/permissions', permissionRoutes)
router.use('/role-permissions', rolePermissionRoutes)
router.use('/user-permissions', userPermissionRoutes)
router.use('/users', userRoutes)
router.use('/companies', companyRoutes)
router.use('/customers', customerRoutes)
router.use('/status-masters', statusMasterRoutes)
router.use('/subscription-plans', subscriptionPlansRoutes)
router.use('/assets', assetManagementRoutes)
router.use('/chats', chatRoutes)

export default router
