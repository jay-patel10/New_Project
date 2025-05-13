import db from '../models/index.js';
const { SubscriptionPlan } = db;

// Create a new subscription plan
export const createSubscriptionPlan = async (req, res) => {
  const { name, description, price, isActive = true, durationInDays } = req.body;

  if (!name || !price || !durationInDays) {
    return res.status(400).json({ error: 'Name, price, and durationInDays are required.' });
  }

  try {
    const newSubscriptionPlan = await SubscriptionPlan.create({
      name,
      description,
      price,
      isActive,
      durationInDays,
    });

    res.status(201).json({
      message: 'Subscription Plan created successfully.',
      data: newSubscriptionPlan,
    });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get all subscription plans with pagination
export const getAllSubscriptionPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ message: 'Invalid pagination parameters' });
    }

    const offset = (page - 1) * limit;
    const total = await SubscriptionPlan.count();
    const totalPages = Math.ceil(total / limit);

    if (offset >= total) {
      return res.status(200).json({
        page,
        limit,
        total,
        totalPages,
        data: [],
      });
    }

    const subscriptionPlans = await SubscriptionPlan.findAll({ limit, offset });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      data: subscriptionPlans,
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching subscription plans', error: err.message });
  }
};

// Get a single subscription plan by ID
export const getSubscriptionPlanById = async (req, res) => {
  const { id } = req.params;

  try {
    const subscriptionPlan = await SubscriptionPlan.findByPk(id);
    if (!subscriptionPlan) {
      return res.status(404).json({ error: 'Subscription Plan not found.' });
    }
    res.status(200).json({ data: subscriptionPlan });
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Update a subscription plan by ID
export const updateSubscriptionPlan = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, isActive, durationInDays } = req.body;

  try {
    const existingSubscriptionPlan = await SubscriptionPlan.findByPk(id);
    if (!existingSubscriptionPlan) {
      return res.status(404).json({ error: 'Subscription Plan not found.' });
    }

    existingSubscriptionPlan.name = name || existingSubscriptionPlan.name;
    existingSubscriptionPlan.description = description || existingSubscriptionPlan.description;
    existingSubscriptionPlan.price = price || existingSubscriptionPlan.price;
    existingSubscriptionPlan.isActive = isActive !== undefined ? isActive : existingSubscriptionPlan.isActive;
    existingSubscriptionPlan.durationInDays = durationInDays || existingSubscriptionPlan.durationInDays;

    await existingSubscriptionPlan.save();

    res.status(200).json({
      message: 'Subscription Plan updated successfully.',
      data: existingSubscriptionPlan,
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Delete a subscription plan by ID
export const deleteSubscriptionPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await SubscriptionPlan.destroy({ where: { id } });
    if (!deletedCount) {
      return res.status(404).json({ error: 'Subscription Plan not found.' });
    }
    res.status(200).json({ message: 'Subscription Plan deleted successfully.' });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
