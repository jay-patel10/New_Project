// app.js
import express from 'express'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import cors from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import db from './models/index.js'
import apiRoutes from './routes/index.js'

dotenv.config()
const app = express()
const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*', // adjust in production
    methods: ['GET', 'POST']
  }
})

app.use(cors())
app.use(express.json())

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Register all v1 routes here
app.use('/api', apiRoutes)

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Authentication API!')
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  socket.on('join', (userId) => {
    socket.join(userId.toString())
    console.log(`User ${userId} joined their room.`)
  })

  socket.on('send_message', async (data) => {
    const { senderId, recipientId, message } = data

    try {
      // Save message to DB
      await db.Chat.create({
        user_id: senderId,
        recipient_id: recipientId,
        message
      })

      // Emit to recipient
      io.to(recipientId.toString()).emit('receive_message', {
        senderId,
        message
      })
    } catch (error) {
      console.error('Error saving chat:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`)
  console.log(new Date())
})

// Optional: export io if needed elsewhere
export { io }
