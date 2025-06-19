import db from '../models/index.js'
import { Op } from 'sequelize'
const { UserPermission, Permission } = db

export const assignPermissionsToUser = async (req, res) => {
  const { userId, permissionId } = req.body

  if (!userId || !Array.isArray(permissionId) || permissionId.length === 0) {
    return res.status(400).json({ status: 'error', message: 'userId and permissionId are required and must be an array' })
  }

  try {
    const validPermissions = await Permission.findAll({
      where: {
        id: { [Op.in]: permissionId }
      }
    })

    if (validPermissions.length !== permissionId.length) {
      return res.status(400).json({ status: 'error', message: 'Some permissionIds are invalid' })
    }

    const transaction = await db.sequelize.transaction()

    try {
      const userPermission = await UserPermission.findOne({ where: { userId }, transaction })

      if (!userPermission) {
        await UserPermission.create({ userId, permissionId }, { transaction })
      } else {
        const currentPermissions = userPermission.permissionId || []
        const updatedPermissions = [...new Set([...currentPermissions, ...permissionId])]

        userPermission.permissionId = updatedPermissions
        await userPermission.save({ transaction })
      }

      await transaction.commit()
      res.status(200).json({ status: 'success', message: 'Permissions assigned to user successfully' })
    } catch (err) {
      await transaction.rollback()
      console.error('Error assigning permissions:', err)
      res.status(500).json({ status: 'error', message: 'Error assigning permissions', error: err.message })
    }
  } catch (err) {
    console.error('Error assigning permissions:', err)
    res.status(500).json({ status: 'error', message: 'Error assigning permissions', error: err.message })
  }
}

export const removePermissionsFromUser = async (req, res) => {
  const { userId, permissionId } = req.body

  if (!userId || !Array.isArray(permissionId) || permissionId.length === 0) {
    return res.status(400).json({ status: 'error', message: 'userId and permissionId are required and must be an array' })
  }

  try {
    const transaction = await db.sequelize.transaction()

    try {
      const userPermission = await UserPermission.findOne({ where: { userId }, transaction })

      if (!userPermission) {
        return res.status(404).json({ status: 'error', message: 'User permission entry not found' })
      }

      const currentPermissions = userPermission.permissionId || []
      const updatedPermissions = currentPermissions.filter(perm => !permissionId.includes(perm))

      userPermission.permissionId = updatedPermissions
      await userPermission.save({ transaction })

      await transaction.commit()
      res.status(200).json({ status: 'success', message: 'Permissions removed from user successfully' })
    } catch (err) {
      await transaction.rollback()
      console.error('Error removing permissions:', err)
      res.status(500).json({ status: 'error', message: 'Error removing permissions', error: err.message })
    }
  } catch (err) {
    console.error('Error removing permissions:', err)
    res.status(500).json({ status: 'error', message: 'Error removing permissions', error: err.message })
  }
}
