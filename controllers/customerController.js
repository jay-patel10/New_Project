import db from '../models/index.js';
const { Customer } = db;

// Create a new customer
export const createCustomer = async (req, res) => {
  try {
    const {
      customerName,
      city,
      state,
      country,
      pin,
      social,
      contact,
      email,
      status,
      description,
      organization,
      leadSource,
    } = req.body;

    if (!customerName || !email || !contact) {
      return res.status(400).json({ message: 'Customer name, email, and contact are required' });
    }

    const customer = await Customer.create({
      customerName,
      city,
      state,
      country,
      pin,
      social,
      contact,
      email,
      status,
      description,
      organization,
      leadSource,
    });

    return res.status(201).json({
      message: `New customer ${customer.customerName} created successfully.`
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all customers (paginated, include ID and all fields)
export const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.body;
    const offset = (page - 1) * limit;

    const { count, rows } = await Customer.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'ASC']],
    });

    return res.status(200).json({
      page: parseInt(page),
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get customer by ID (include all fields)
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id); // No attributes config — includes all fields

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    return res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a customer (include all fields in response)
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.update(req.body);

    return res.status(200).json({
      message: 'Customer updated successfully.',
      data: customer, // Includes all fields, including id
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.destroy();

    return res.status(200).json({ message: `Customer ${customer.customerName} deleted `});
  } catch (error) {
    console.error('Error deleting customer:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
