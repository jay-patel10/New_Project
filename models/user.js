import { Model, DataTypes } from 'sequelize';

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(150),
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        otp: {
          type: DataTypes.STRING(10),
          allowNull: true,
        },
        otpExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        verificationToken: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        verificationDeadline: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        isVerified: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        loginToken: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        loginTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        companyId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'Companies', // Reference to the 'Companies' table
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        subscriptionPlanId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'subscription_plans', // Reference to the 'subscription_plans' table
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
      }
    );
  }
}

export default User;
