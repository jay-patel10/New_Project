import { Sequelize } from 'sequelize';
import config from '../config/config.js';
import User from './user.js';
import RoleModel from './role.js';
import PermissionModel from './permission.js';
import RolePermissionModel from './rolePermission.js';

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
  console.log('Database connection established successfully.');
} catch (err) {
  console.error('Database connection error:', err);
}

// Initialize models
const Role = RoleModel(sequelize);
const Permission = PermissionModel(sequelize);
const RolePermission = RolePermissionModel(sequelize, Sequelize.DataTypes);
User.init(sequelize, Sequelize.DataTypes);

// Define associations
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'permissions',
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'roles',
});

// Add models to db object
db.User = User;
db.Role = Role;
db.Permission = Permission;
db.RolePermission = RolePermission;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
