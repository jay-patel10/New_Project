import { Sequelize, DataTypes } from 'sequelize'
import config from '../config/config.js'
import User from './user.js'
import Role from './role.js'
import Permission from './permission.js'
import RolePermission from './rolePermission.js'
import UserPermission from './userPermission.js'
import Company from './company.js'
import Customer from './customer.js'
import StatusMaster from './statusMaster.js'
import SubscriptionPlan from './subscriptionPlan.js'
import AssetManagement from './assetManagement.js'
import Chat from './chat.js'

const db = {}
const env = process.env.NODE_ENV || 'development'
const dbConfig = config[env]

// Initialize Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: false,
    define: {
      freezeTableName: true,
      underscored: false
    }
  }
)

// Test the database connection
// Test the database connection inside an async IIFE
;(async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection established.')
  } catch (err) {
    console.error('❌ Database connection error:', err)
  }
})()

// Initialize models
User.init(sequelize, DataTypes)
Role.init(sequelize, DataTypes)
Permission.init(sequelize, DataTypes)
RolePermission.init(sequelize)
UserPermission.init(sequelize)
Company.init(sequelize, DataTypes)
Customer.init(sequelize, DataTypes)
StatusMaster.init(sequelize, DataTypes)
SubscriptionPlan.init(sequelize, DataTypes)
AssetManagement.init(sequelize, DataTypes)
Chat.init(sequelize)

// Add models to db object
db.sequelize = sequelize
db.Sequelize = Sequelize

db.User = User
db.Role = Role
db.Permission = Permission
db.RolePermission = RolePermission
db.UserPermission = UserPermission
db.Company = Company
db.Customer = Customer
db.StatusMaster = StatusMaster
db.SubscriptionPlan = SubscriptionPlan
db.AssetManagement = AssetManagement
db.Chat = Chat

// Define associations here if needed
// Example: db.AssetManagement.belongsTo(db.Company, { foreignKey: 'companyId' });

export default db
