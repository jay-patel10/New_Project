// app.js
import express from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import verifyToken from './middlewares/verifyToken.js';
import swaggerSpec from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import permissionRoutes from './routes/permissionRoutes.js'
import rolePermissionRoutes from './routes/rolePermissionRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth Routes
app.use('/api/auth', authRoutes);

app.use('/api/roles',roleRoutes);

app.use('/api/permissions',verifyToken,permissionRoutes)

app.use('/api/role-permissions' ,rolePermissionRoutes)

// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to the Authentication API!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
  console.log(new Date());
});