import db from '../models/index.js';
const { Company } = db;

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const { companyName, companyAddress, city, state, country, taxNumber } = req.body;

    if (!companyName || !taxNumber) {
      return res.status(400).json({ message: 'Company name and tax number are required' });
    }

    const newCompany = await Company.create({
      companyName,
      companyAddress,
      city,
      state,
      country,
      taxNumber,
    });

    return res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a company by ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json(company);
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a company
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, companyAddress, city, state, country, taxNumber } = req.body;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.update({
      companyName,
      companyAddress,
      city,
      state,
      country,
      taxNumber,
    });

    return res.status(200).json({ message: 'Company updated', company });
  } catch (error) {
    console.error('Error updating company:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.destroy();

    return res.status(200).json({ message: 'Company deleted' });
  } catch (error) {
    console.error('Error deleting company:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all companies (paginated)
export const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;

    const offset = (page - 1) * limit;

    const { count, rows } = await Company.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
