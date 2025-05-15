import db from '../models/index.js';
const { AssetManagement } = db;

// Create a new asset
export const createAsset = async (req, res) => {
  try {
    const asset = await AssetManagement.create(req.body);
    res.status(201).json({ status: 'success', message: 'Asset created successfully', data: asset });
  } catch (err) {
    console.error('Error creating asset:', err);
    res.status(500).json({ status: 'error', message: 'Failed to create asset', error: err.message });
  }
};

// Get all assets
export const getAllAssets = async (req, res) => {
  try {
    const assets = await AssetManagement.findAll();
    res.status(200).json({ status: 'success', data: assets });
  } catch (err) {
    console.error('Error fetching assets:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch assets', error: err.message });
  }
};

// Get a single asset by ID
export const getAssetById = async (req, res) => {
  try {
    const asset = await AssetManagement.findByPk(req.params.id);
    if (!asset) {
      return res.status(404).json({ status: 'error', message: 'Asset not found' });
    }
    res.status(200).json({ status: 'success', data: asset });
  } catch (err) {
    console.error('Error fetching asset:', err);
    res.status(500).json({ status: 'error', message: 'Failed to fetch asset', error: err.message });
  }
};

// Update an asset by ID
export const updateAsset = async (req, res) => {
  try {
    const [updatedCount] = await AssetManagement.update(req.body, { where: { id: req.params.id } });
    if (updatedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Asset not found or no changes made' });
    }
    res.status(200).json({ status: 'success', message: 'Asset updated successfully' });
  } catch (err) {
    console.error('Error updating asset:', err);
    res.status(500).json({ status: 'error', message: 'Failed to update asset', error: err.message });
  }
};

// Delete an asset by ID
export const deleteAsset = async (req, res) => {
  try {
    const deletedCount = await AssetManagement.destroy({ where: { id: req.params.id } });
    if (deletedCount === 0) {
      return res.status(404).json({ status: 'error', message: 'Asset not found' });
    }
    res.status(200).json({ status: 'success', message: 'Asset deleted successfully' });
  } catch (err) {
    console.error('Error deleting asset:', err);
    res.status(500).json({ status: 'error', message: 'Failed to delete asset', error: err.message });
  }
};
