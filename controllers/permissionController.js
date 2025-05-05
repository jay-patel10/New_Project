import db from '../models/index.js';
const { Permission } = db;

// Create permission
export const createPermission = async (req, res) => {
    try {
      const userName = req.user?.name;
  
      if (!userName) {
        return res.status(401).json({ message: 'Unauthorized: User name not found in request' });
      }
  
      const { name, status } = req.body;
  
      const permission = await Permission.create({
        name,
        status,
        created_by: userName,
        updated_by: userName, // Same as created_by at creation time
      });
  
      res.status(201).json(permission);
    } catch (err) {
      res.status(500).json({ message: 'Error creating permission', error: err.message });
    }
  };
  
// Get all permissions
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching permissions', error: err.message });
  }
};

// Get permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await Permission.findByPk(id);

    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    res.json(permission);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching permission', error: err.message });
  }
};

// Update permission
export const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const userId = req.user?.user_id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User not found in request' });
    }

    const permission = await Permission.findByPk(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    await permission.update({ name, status, updated_by: userId });

    res.json(permission);
  } catch (err) {
    res.status(500).json({ message: 'Error updating permission', error: err.message });
  }
};

// Delete permission
export const deletePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });

    await permission.destroy();
    res.json({ message: 'Permission deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting permission', error: err.message });
  }
};
