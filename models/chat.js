import { Model, DataTypes } from 'sequelize'

class Chat extends Model {
  static init(sequelize) {
    return super.init(
      {
        uuid: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        recipient_id: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      },
      {
        sequelize,
        modelName: 'Chat',
        tableName: 'chats',
        timestamps: true
      }
    )
  }

  static associate(models) {
    Chat.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'sender'
    })

    Chat.belongsTo(models.User, {
      foreignKey: 'recipient_id',
      as: 'recipient'
    })
  }
}

export default Chat
