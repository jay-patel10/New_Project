import { Sequelize, DataTypes } from 'sequelize';
import config from '../config/config.js';

import User from './user.js';
import Role from './role.js';
import Permission from './permission.js';
import RolePermission from './rolePermission.js';

const db = {};
const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

// Test the database connection
try {
  await sequelize.authenticate();
  console.log('✅ Database connection established.');
} catch (err) {
  console.error('❌ Database connection error:', err);
}

// Initialize models
User.init(sequelize, DataTypes);
Role.init(sequelize, DataTypes);
Permission.init(sequelize, DataTypes);
RolePermission.init(sequelize); // ✅ Only pass sequelize as you did in your class

// Add models to db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Role = Role;
db.Permission = Permission;
db.RolePermission = RolePermission;

// Define associations
db.User.belongsTo(db.Role, { foreignKey: 'roleId', as: 'role' });
db.Role.hasMany(db.User, { foreignKey: 'roleId', as: 'users' });

db.Role.belongsToMany(db.Permission, {
  through: db.RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});

db.Permission.belongsToMany(db.Role, {
  through: db.RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});

export default db;
