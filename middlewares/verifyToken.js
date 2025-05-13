import db from '../models/index.js';

const { User } = db;

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Login First' });
  }

  try {
    // Find user by login token
    const user = await User.findOne({ where: { loginToken: token } }); // Updated to camelCase

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    // Check if the token is expired
    if (!user.loginTokenExpiresAt || new Date(user.loginTokenExpiresAt) < new Date()) { // Updated to camelCase
      return res.status(401).json({ message: 'Token expired' });
    }

    // Attach user info to the request
    req.user = {
      userId: user.id, // Updated to camelCase
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Token verification failed', error: err.message });
  }
};

export default verifyToken;
