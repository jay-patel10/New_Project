import db from '../models/index.js';
import bcrypt from 'bcrypt';

const { User } = db;

export const createUser = async (req, res) => {
  const { name, email, password, status = true } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password are required.' });
  }

  // Validate email and password
  if (!validateEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email format.' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ status: 'error', message: 'Password does not meet the required strength.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      is_verified: false,
    });

    res.status(201).json({ status: 'success', message: 'User created successfully.', data: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid pagination parameters.' });
  }

  try {
    const offset = (page - 1) * limit;
    const total = await User.count();
    const totalPages = Math.ceil(total / limit);

    if (offset >= total) {
      return res.status(200).json({ status: 'success', page, limit, total, totalPages, data: [] });
    }

    const users = await User.findAll({ limit, offset });

    res.status(200).json({
      status: 'success',
      page,
      limit,
      total,
      totalPages,
      data: users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ status: 'error', message: 'Error fetching users.', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, is_verified } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (is_verified !== undefined) {
      user.is_verified = is_verified;
    }

    await user.save();

    res.status(200).json({ status: 'success', message: 'User updated successfully.', data: user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'User not found.' });
    }
    res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
};
