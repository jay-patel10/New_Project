import db from '../models/index.js';
const { RolePermission } = db;

export const assignPermissionsToRole = async (req, res) => {
  const { role_id, permission_id } = req.body;

  if (!role_id || !Array.isArray(permission_id) || permission_id.length === 0) {
    return res.status(400).json({ message: 'role_id and permission_id are required' });
  }

  try {
    let rolePermission = await RolePermission.findOne({ where: { role_id } });

    if (!rolePermission) {
      await RolePermission.create({
        role_id,
        permission_id: JSON.stringify(permission_id), // ✅ Convert to JSON string
      });
    } else {
      const currentPermissions = JSON.parse(rolePermission.permission_id || '[]'); // ✅ Parse existing JSON
      const updatedPermissions = [...new Set([...currentPermissions, ...permission_id])];

      rolePermission.permission_id = JSON.stringify(updatedPermissions); // ✅ Convert to JSON string
      await rolePermission.save();
    }

    res.status(200).json({ message: 'Permissions assigned to role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning permissions', error: err.message });
  }
};

export const removePermissionsFromRole = async (req, res) => {
  const { role_id, permission_id } = req.body;

  if (!role_id || !Array.isArray(permission_id) || permission_id.length === 0) {
    return res.status(400).json({ message: 'role_id and permission_id are required' });
  }

  try {
    let rolePermission = await RolePermission.findOne({ where: { role_id } });

    if (!rolePermission) {
      return res.status(404).json({ message: 'Role permission entry not found' });
    }

    const currentPermissions = JSON.parse(rolePermission.permission_id || '[]');
    const updatedPermissions = currentPermissions.filter(
      perm => !permission_id.includes(perm)
    );

    rolePermission.permission_id = JSON.stringify(updatedPermissions); // ✅ Convert to JSON string
    await rolePermission.save();

    res.status(200).json({ message: 'Permissions removed from role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing permissions', error: err.message });
  }
};
