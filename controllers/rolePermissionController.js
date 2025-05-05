import db from '../models/index.js';

const { RolePermission } = db;

export const assignPermissionsToRole = async (req, res) => {
  const { role_id, permission_ids } = req.body;

  if (!role_id || !Array.isArray(permission_ids) || permission_ids.length === 0) {
    return res.status(400).json({ message: 'role_id and permission_ids are required' });
  }

  try {
    // Create bulk role-permission associations
    const rolePermissions = permission_ids.map(permission_id => ({
      role_id,
      permission_id,
    }));

    await RolePermission.bulkCreate(rolePermissions, { ignoreDuplicates: true });

    res.status(200).json({ message: 'Permissions assigned to role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning permissions', error: err.message });
  }
};

export const removePermissionsFromRole = async (req, res) => {
  const { role_id, permission_ids } = req.body;

  if (!role_id || !Array.isArray(permission_ids) || permission_ids.length === 0) {
    return res.status(400).json({ message: 'role_id and permission_ids are required' });
  }

  try {
    // Remove specific role-permission associations
    await RolePermission.destroy({
      where: {
        role_id,
        permission_id: permission_ids,
      },
    });

    res.status(200).json({ message: 'Permissions removed from role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing permissions', error: err.message });
  }
};
