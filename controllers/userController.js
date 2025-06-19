import db from '../models/index.js'
import bcrypt from 'bcrypt'
const { User } = db

export const createUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and password are required.' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email format.' })
  }

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'Email already exists.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false
    })

    const response = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      companyId: newUser.companyId,
      subscriptionPlanId: newUser.subscriptionPlanId,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    }

    return res.status(201).json({
      status: 'success',
      message: 'User created successfully.',
      data: response
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return res.status(500).json({ status: 'error', message: 'Internal server error.' })
  }
}

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.body

  if (page <= 0 || limit <= 0) {
    return res.status(400).json({ status: 'error', message: 'Invalid pagination parameters.' })
  }

  try {
    const offset = (page - 1) * limit
    const total = await User.count()
    const totalPages = Math.ceil(total / limit)

    const users = await User.findAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      attributes: [
        'id',
        'name',
        'email',
        'companyId',
        'subscriptionPlanId',
        'createdAt',
        'updatedAt'
      ]
    })

    return res.status(200).json({
      page: parseInt(page),
      totalPages,
      data: users
    })
  } catch (err) {
    console.error('Error fetching users:', err)
    return res.status(500).json({ status: 'error', message: 'Error fetching users.' })
  }
}

export const getUserById = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'name',
        'email',
        'companyId',
        'subscriptionPlanId',
        'createdAt',
        'updatedAt'
      ]
    })

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }

    return res.status(200).json({ status: 'success', data: user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return res.status(500).json({ status: 'error', message: 'Internal server error.' })
  }
}
export const updateUser = async (req, res) => {
  const { id } = req.params
  const { name, email, password, isVerified } = req.body

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  try {
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }

    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ status: 'error', message: 'Invalid email format.' })
    }

    user.name = name || user.name
    user.email = email || user.email

    if (password) {
      user.password = await bcrypt.hash(password, 10)
    }

    if (typeof isVerified !== 'undefined') {
      user.isVerified = isVerified
    }

    await user.save()

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      subscriptionPlanId: user.subscriptionPlanId,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return res.status(200).json({
      status: 'success',
      message: 'User updated successfully.',
      data: response
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return res.status(500).json({ status: 'error', message: 'Internal server error.' })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found.' })
    }

    await user.destroy()

    return res.status(200).json({
      status: 'success',
      message: `User ${user.name} deleted successfully.`
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ status: 'error', message: 'Internal server error.' })
  }
}

export const subscribeUser = async (req, res) => {
  const { userId, subscriptionPlanId } = req.body

  if (!userId || !subscriptionPlanId) {
    return res.status(400).json({ status: 'error', message: 'userId and subscriptionPlanId are required.' })
  }

  try {
    const user = await User.findByPk(userId)
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' })

    const plan = await db.SubscriptionPlan.findByPk(subscriptionPlanId)
    if (!plan) return res.status(404).json({ status: 'error', message: 'Subscription plan not found.' })

    user.subscriptionPlanId = subscriptionPlanId
    await user.save()

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      subscriptionPlanId: user.subscriptionPlanId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return res.status(200).json({
      status: 'success',
      message: 'User subscribed to plan successfully.',
      data: response
    })
  } catch (err) {
    console.error('Error subscribing user:', err)
    return res.status(500).json({ status: 'error', message: 'Internal server error.' })
  }
}

export const unsubscribeUser = async (req, res) => {
  const { id } = req.params

  try {
    const user = await db.User.findByPk(id)
    if (!user) return res.status(404).json({ status: 'error', message: 'User not found.' })

    user.subscriptionPlanId = null
    await user.save()

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      companyId: user.companyId,
      subscriptionPlanId: user.subscriptionPlanId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

    return res.status(200).json({
      status: 'success',
      message: 'User unsubscribed successfully.',
      data: response
    })
  } catch (err) {
    console.error('Error unsubscribing user:', err)
    return res.status(500).json({ status: 'error', message: 'Internal server error.' })
  }
}
