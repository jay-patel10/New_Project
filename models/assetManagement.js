import { Model, DataTypes } from 'sequelize'

class AssetManagement extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        assetTag: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true
        },
        serialNumber: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        name: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        category: {
          type: DataTypes.STRING(50),
          allowNull: true
        },
        location: {
          type: DataTypes.STRING(100),
          allowNull: true
        },
        status: {
          type: DataTypes.ENUM('available', 'assigned', 'in_repair', 'retired'),
          allowNull: false,
          defaultValue: 'available'
        },
        purchaseDate: {
          type: DataTypes.DATE,
          allowNull: true
        },
        warrantyExpiry: {
          type: DataTypes.DATE,
          allowNull: true
        },
        value: {
          type: DataTypes.FLOAT,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'AssetManagement',
        tableName: 'assets_management',
        timestamps: true
      }
    )
  }
}

export default AssetManagement
