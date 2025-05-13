import { Model, DataTypes } from 'sequelize';

class SubscriptionPlan extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        durationInDays: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        features: {
          type: DataTypes.JSON,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'SubscriptionPlan',
        tableName: 'subscription_plans',
        timestamps: true,
      }
    );
  }
}

export default SubscriptionPlan;
