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
      // No existing role permission, create a new record
      await RolePermission.create({
        role_id,
        permission_id: permission_id, // Directly store permission_id as an array (no stringify)
      });
    } else {
      const currentPermissions = rolePermission.permission_id || []; // Directly access permission_id (already an array)
      console.log('Current Permissions:', currentPermissions);

      const updatedPermissions = [...new Set([...currentPermissions, ...permission_id])]; // Merge and remove duplicates
      console.log('Updated Permissions:', updatedPermissions);

      rolePermission.permission_id = updatedPermissions; // Update with new permissions (as an array)
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

    const currentPermissions = rolePermission.permission_id || [];
    console.log('Current Permissions Before Removal:', currentPermissions);

    const updatedPermissions = currentPermissions.filter(perm => !permission_id.includes(perm));
    console.log('Updated Permissions After Removal:', updatedPermissions);

    // Save the updated permissions as an array
    rolePermission.permission_id = updatedPermissions; // Directly update permission_id as an array
    await rolePermission.save();

    res.status(200).json({ message: 'Permissions removed from role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing permissions', error: err.message });
  }
};
