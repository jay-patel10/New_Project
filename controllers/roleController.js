import db from '../models/index.js';

const { Role } = db;

export const createRole = async (req, res) => {
  const { role, status = true } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Role is required.' });
  }

  try {
    const newRole = await Role.create({ role, status });
    res.status(201).json({ message: 'Role created successfully.', data: newRole });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.body.page, 10) || 1;
    const limit = parseInt(req.body.limit, 10) || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const offset = (page - 1) * limit;
    const total = await Role.count();
    const totalPages = Math.ceil(total / limit);

    if (offset >= total) {
      return res.status(200).json({
        page,
        totalPages,
        data: [],
      });
    }

    const roles = await Role.findAll({
      limit,
      offset
    });

    res.status(200).json({
      page,
      totalPages,
      data: roles,
    });

  } catch (err) {
    console.error('Error fetching roles:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found.' });
    }
    res.status(200).json({ data: role });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role, status } = req.body;

  try {
    const existingRole = await Role.findByPk(id);
    if (!existingRole) {
      return res.status(404).json({ error: 'Role not found.' });
    }

    existingRole.role = role || existingRole.role;
    if (status !== undefined) {
      existingRole.status = status;
    }

    await existingRole.save();

    res.status(200).json({ message: 'Role updated successfully.', data: existingRole });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    // First, find the role
    const role = await Role.findByPk(id);

    if (!role) {
      return res.status(404).json({ error: 'Role not found.' });
    }
    const roleName = role.role;

    await Role.destroy({ where: { id } });

    return res.status(200).json({ message: `${roleName} deleted` });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
