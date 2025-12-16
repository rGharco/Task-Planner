/**
 * Task Planner Server
 * Main entry point for the Express application
 */
const express = require('express');
const { sequelize } = require('./models');
const cors = require('cors');  

// Import routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const subtaskRoutes = require('./routes/subtasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Development only (CORS)
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Task Planner API is running' });
});

// Initialize database and start server
console.log('Starting server...');

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });