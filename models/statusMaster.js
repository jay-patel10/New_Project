import { Model, DataTypes } from 'sequelize'

class StatusMaster extends Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: 'active'
        }
      },
      {
        sequelize,
        modelName: 'StatusMaster',
        tableName: 'status_masters',
        timestamps: true
      }
    )
  }
}

export default StatusMaster
