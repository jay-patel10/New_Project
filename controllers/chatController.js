import db from '../models/index.js'
const { Chat, Sequelize } = db
const { Op } = Sequelize

// Send a new chat message
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body
    const { userId } = req.user

    if (!recipientId || !message) {
      return res.status(400).json({ error: 'recipientId and message are required.' })
    }

    const newMessage = await Chat.create({
      user_id: userId,
      recipient_id: recipientId,
      message
    })

    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get messages between current user and another user
export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { userId: otherUserId } = req.params
    const { userId } = req.user

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { user_id: userId, recipient_id: otherUserId },
          { user_id: otherUserId, recipient_id: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    })

    res.status(200).json(messages)
  } catch (error) {
    console.error('Error retrieving messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Get all chat users current user has conversed with
export const getChatUsers = async (req, res) => {
  try {
    const { userId } = req.user

    const recipients = await Chat.findAll({
      where: { user_id: userId },
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('recipient_id')), 'recipientId']
      ],
      raw: true
    })

    res.status(200).json(recipients)
  } catch (error) {
    console.error('Error fetching recipients:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Delete a message by UUID (only if sender)
export const deleteMessage = async (req, res) => {
  try {
    const { uuid } = req.body

    if (!uuid) {
      return res.status(400).json({ error: 'UUID is required in request body.' })
    }

    const message = await Chat.findOne({
      where: {
        uuid: {
          [Op.eq]: uuid
        }
      }
    })

    if (!message) {
      return res.status(404).json({ error: 'Message not found.' })
    }

    await message.destroy()

    return res.status(200).json({ message: 'Message deleted successfully.' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
