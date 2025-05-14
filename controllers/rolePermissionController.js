import db from '../models/index.js';
const { RolePermission } = db;

export const assignPermissionsToRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !Array.isArray(permissionId) || permissionId.length === 0) {
    return res.status(400).json({ message: 'roleId and permissionId are required and permissionId must be an array' });
  }

  try {
    let rolePermission = await RolePermission.findOne({ where: { roleId } });

    if (!rolePermission) {
      await RolePermission.create({
        roleId,
        permissionId, // store as array
      });
    } else {
      const currentPermissions = rolePermission.permissionId || [];
      const updatedPermissions = [...new Set([...currentPermissions, ...permissionId])];

      rolePermission.permissionId = updatedPermissions;
      await rolePermission.save();
    }

    res.status(200).json({ message: 'Permissions assigned to role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error assigning permissions', error: err.message });
  }
};

export const removePermissionsFromRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !Array.isArray(permissionId) || permissionId.length === 0) {
    return res.status(400).json({ message: 'roleId and permissionId are required and permissionId must be an array' });
  }

  try {
    let rolePermission = await RolePermission.findOne({ where: { roleId } });

    if (!rolePermission) {
      return res.status(404).json({ message: 'Role permission entry not found' });
    }

    const currentPermissions = rolePermission.permissionId || [];
    const updatedPermissions = currentPermissions.filter(perm => !permissionId.includes(perm));

    rolePermission.permissionId = updatedPermissions;
    await rolePermission.save();

    res.status(200).json({ message: 'Permissions removed from role successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing permissions', error: err.message });
  }
};
