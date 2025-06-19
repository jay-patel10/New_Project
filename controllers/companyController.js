import db from '../models/index.js'
const { Company } = db

// Create a new company
export const createCompany = async (req, res) => {
  try {
    const { companyName, companyAddress, city, state, country, taxNumber } = req.body

    if (!companyName || !taxNumber) {
      return res.status(400).json({ message: 'Company name and tax number are required' })
    }

    const newCompany = await Company.create({
      companyName,
      companyAddress,
      city,
      state,
      country,
      taxNumber
    })

    return res.status(201).json({
      message: `New company ${newCompany.companyName} created successfully.`
    })
  } catch (error) {
    console.error('Error creating company:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body

    const offset = (page - 1) * limit

    const { count, rows } = await Company.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'ASC']]
    })

    return res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows
    })
  } catch (error) {
    console.error('Error fetching companies:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params

    const company = await Company.findByPk(id) // No attributes excluded

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    return res.status(200).json(company)
  } catch (error) {
    console.error('Error fetching company by ID:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Update a company (return all fields including ID)
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params
    const { companyName, companyAddress, city, state, country, taxNumber } = req.body

    const company = await Company.findByPk(id)

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    await company.update({
      companyName,
      companyAddress,
      city,
      state,
      country,
      taxNumber
    })

    return res.status(200).json({
      message: 'Company updated successfully.',
      data: company // Includes all fields including ID
    })
  } catch (error) {
    console.error('Error updating company:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete a company
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params

    const company = await Company.findByPk(id)

    if (!company) {
      return res.status(404).json({ message: 'Company not found' })
    }

    await company.destroy()

    return res.status(200).json({ message: `Company ${company.companyName} deleted ` })
  } catch (error) {
    console.error('Error deleting company:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
