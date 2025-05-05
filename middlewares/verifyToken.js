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
    const user = await User.findOne({ where: { login_token: token } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token or user not found' });
    }

    // Check if the token is expired
    if (!user.login_token_expires_at || new Date(user.login_token_expires_at) < new Date()) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Attach user info to the request
    req.user = {
      user_id: user.id,
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Token verification failed', error: err.message });
  }
};

export default verifyToken;
