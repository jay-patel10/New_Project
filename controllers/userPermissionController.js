import db from '../models/index.js';
const { UserPermission, Permission } = db;
import { Op } from 'sequelize';

export const assignPermissionsToUser = async (req, res) => {
  const { user_id, permission_id } = req.body;

  // Validate inputs
  if (!user_id || !Array.isArray(permission_id) || permission_id.length === 0) {
    return res.status(400).json({ status: 'error', message: 'user_id and permission_id are required' });
  }

  try {
    // Validate that all permission_ids are valid (exist in the database)
    const validPermissions = await Permission.findAll({
      where: {
        id: { [Op.in]: permission_id },
      },
    });

    if (validPermissions.length !== permission_id.length) {
      return res.status(400).json({ status: 'error', message: 'Some permission_ids are invalid' });
    }

    // Begin a transaction to ensure atomicity
    const transaction = await db.sequelize.transaction();

    try {
      let userPermission = await UserPermission.findOne({ where: { user_id }, transaction });

      if (!userPermission) {
        // No existing permission, create a new record
        await UserPermission.create({
          user_id,
          permission_id, // Store permission_id as an array
        }, { transaction });
      } else {
        // Existing permissions, update the list
        const currentPermissions = userPermission.permission_id || [];
        const updatedPermissions = [...new Set([...currentPermissions, ...permission_id])]; // Merge and remove duplicates

        userPermission.permission_id = updatedPermissions; // Update with new permissions (as an array)
        await userPermission.save({ transaction });
      }

      await transaction.commit();
      res.status(200).json({ status: 'success', message: 'Permissions assigned to user successfully' });
    } catch (err) {
      await transaction.rollback();
      console.error('Error assigning permissions:', err);
      res.status(500).json({ status: 'error', message: 'Error assigning permissions', error: err.message });
    }

  } catch (err) {
    console.error('Error assigning permissions:', err);
    res.status(500).json({ status: 'error', message: 'Error assigning permissions', error: err.message });
  }
};

export const removePermissionsFromUser = async (req, res) => {
  const { user_id, permission_id } = req.body;

  // Validate inputs
  if (!user_id || !Array.isArray(permission_id) || permission_id.length === 0) {
    return res.status(400).json({ status: 'error', message: 'user_id and permission_id are required' });
  }

  try {
    // Begin a transaction to ensure atomicity
    const transaction = await db.sequelize.transaction();

    try {
      let userPermission = await UserPermission.findOne({ where: { user_id }, transaction });

      if (!userPermission) {
        return res.status(404).json({ status: 'error', message: 'User permission entry not found' });
      }

      // Get current permissions and filter out the ones to be removed
      const currentPermissions = userPermission.permission_id || [];
      const updatedPermissions = currentPermissions.filter(perm => !permission_id.includes(perm));

      userPermission.permission_id = updatedPermissions; // Update permission_id as an array
      await userPermission.save({ transaction });

      await transaction.commit();
      res.status(200).json({ status: 'success', message: 'Permissions removed from user successfully' });
    } catch (err) {
      await transaction.rollback();
      console.error('Error removing permissions:', err);
      res.status(500).json({ status: 'error', message: 'Error removing permissions', error: err.message });
    }

  } catch (err) {
    console.error('Error removing permissions:', err);
    res.status(500).json({ status: 'error', message: 'Error removing permissions', error: err.message });
  }
};
