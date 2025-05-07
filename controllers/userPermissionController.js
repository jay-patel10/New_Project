import db from '../models/index.js';
const { UserPermission } = db;

export const assignPermissionsToUser = async (req, res) => {
  const { user_id, permission_id } = req.body;

  // Validate inputs
  if (!user_id || !Array.isArray(permission_id) || permission_id.length === 0) {
    return res.status(400).json({ message: 'user_id and permission_id are required' });
  }

  try {
    // Check if the user already has a permission record
    let userPermission = await UserPermission.findOne({ where: { user_id } });

    if (!userPermission) {
      // No existing permission, create a new record
      await UserPermission.create({
        user_id,
        permission_id: permission_id, // Directly store permission_id as an array
      });
    } else {
      // Existing permissions, update the list
      const currentPermissions = userPermission.permission_id || []; // Directly access permission_id (already an array)
      console.log('Current Permissions:', currentPermissions);

      const updatedPermissions = [...new Set([...currentPermissions, ...permission_id])]; // Merge and remove duplicates
      console.log('Updated Permissions:', updatedPermissions);

      userPermission.permission_id = updatedPermissions; // Update with new permissions (as an array)
      await userPermission.save();
    }

    res.status(200).json({ message: 'Permissions assigned to user successfully' });
  } catch (err) {
    console.error('Error assigning permissions:', err);
    res.status(500).json({ message: 'Error assigning permissions', error: err.message });
  }
};

export const removePermissionsFromUser = async (req, res) => {
  const { user_id, permission_id } = req.body;

  // Validate inputs
  if (!user_id || !Array.isArray(permission_id) || permission_id.length === 0) {
    return res.status(400).json({ message: 'user_id and permission_id are required' });
  }

  try {
    // Check if the user has permissions
    let userPermission = await UserPermission.findOne({ where: { user_id } });

    if (!userPermission) {
      return res.status(404).json({ message: 'User permission entry not found' });
    }

    // Get current permissions and filter out the ones to be removed
    const currentPermissions = userPermission.permission_id || [];
    console.log('Current Permissions Before Removal:', currentPermissions);

    const updatedPermissions = currentPermissions.filter(perm => !permission_id.includes(perm));
    console.log('Updated Permissions After Removal:', updatedPermissions);

    // Save the updated permissions
    userPermission.permission_id = updatedPermissions; // Directly update permission_id as an array
    await userPermission.save();

    res.status(200).json({ message: 'Permissions removed from user successfully' });
  } catch (err) {
    console.error('Error removing permissions:', err);
    res.status(500).json({ message: 'Error removing permissions', error: err.message });
  }
};
