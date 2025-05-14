import db from '../models/index.js';
const { StatusMaster } = db;

// Create a new StatusMaster
export const createStatusMaster = async (req, res) => {
  try {
    const { name, status } = req.body;

    if (!name || !status) {
      return res.status(400).json({ message: 'Name and status are required' });
    }

    const newStatus = await StatusMaster.create({ name, status });

    return res.status(201).json(newStatus);
  } catch (error) {
    console.error('Error creating status master:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllStatusMasters = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;

    if (isNaN(page) || page <= 0 || isNaN(limit) || limit <= 0) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const offset = (page - 1) * limit;
    const total = await StatusMaster.count();

    const rows = await StatusMaster.findAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching status masters:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a StatusMaster by ID
export const getStatusMasterById = async (req, res) => {
  try {
    const { id } = req.params;

    const statusMaster = await StatusMaster.findByPk(id);

    if (!statusMaster) {
      return res.status(404).json({ message: 'Status Master not found' });
    }

    return res.status(200).json(statusMaster);
  } catch (error) {
    console.error('Error fetching status master by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a StatusMaster
export const updateStatusMaster = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const statusMaster = await StatusMaster.findByPk(id);

    if (!statusMaster) {
      return res.status(404).json({ message: 'Status Master not found' });
    }

    await statusMaster.update({ name, status });

    return res.status(200).json({ message: 'Status Master updated', statusMaster });
  } catch (error) {
    console.error('Error updating status master:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a StatusMaster
export const deleteStatusMaster = async (req, res) => {
  try {
    const { id } = req.params;

    const statusMaster = await StatusMaster.findByPk(id);

    if (!statusMaster) {
      return res.status(404).json({ message: 'Status Master not found' });
    }

    await statusMaster.destroy();

    return res.status(200).json({ message: 'Status Master deleted' });
  } catch (error) {
    console.error('Error deleting status master:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
