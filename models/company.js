import { Model, DataTypes } from 'sequelize';

class Company extends Model {
  static init(sequelize) {
    return super.init(
      {
        companyName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        companyAddress: {
          type: DataTypes.STRING,
        },
        city: {
          type: DataTypes.STRING,
        },
        state: {
          type: DataTypes.STRING,
        },
        country: {
          type: DataTypes.STRING,
        },
        taxNumber: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'active',
        },
      },
      {
        sequelize,
        modelName: 'Company',
        tableName: 'Companies',
        timestamps: true,
      }
    );
  }
}

export default Company;
