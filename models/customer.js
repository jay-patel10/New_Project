import { Model, DataTypes } from 'sequelize'

class Customer extends Model {
  static init(sequelize) {
    return super.init(
      {
        customerName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        city: {
          type: DataTypes.STRING
        },
        state: {
          type: DataTypes.STRING
        },
        country: {
          type: DataTypes.STRING
        },
        pin: {
          type: DataTypes.STRING
        },
        social: {
          type: DataTypes.STRING
        },
        contact: {
          type: DataTypes.STRING
        },
        email: {
          type: DataTypes.STRING,
          validate: {
            isEmail: true
          }
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'active'
        },
        description: {
          type: DataTypes.TEXT
        },
        organization: {
          type: DataTypes.STRING
        },
        leadSource: {
          type: DataTypes.STRING
        }
      },
      {
        sequelize,
        modelName: 'Customer',
        tableName: 'customers',
        timestamps: true
      }
    )
  }
}

export default Customer
