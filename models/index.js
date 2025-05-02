import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import User from './user.js';
import RoleModel from './role.js';

const db = {};
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  logging: false,  // Set to true for SQL query logs
});

try {
  // Test the database connection
  await sequelize.authenticate();
  console.log('Database connection established successfully.');
} catch (err) {
  console.error('Database connection error:', err);
}

// Initialize models
const Role = RoleModel(sequelize);  // Since Role uses a factory function
User.init(sequelize, Sequelize.DataTypes);

// Define associations (if any)
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

// Add models to the db object
db.User = User;
db.Role = Role;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
