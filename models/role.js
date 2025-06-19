import { Model, DataTypes } from 'sequelize'

class Role extends Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        role: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        status: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: true
      }
    )
  }
}

export default Role
