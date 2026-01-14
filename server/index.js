/**
 * Task Planner Server
 * Main entry point for the Express application
 */
const express = require('express');
const cors = require('cors'); // Declared ONLY here
const { sequelize, User } = require('./models');

// Import routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');
const subtaskRoutes = require('./routes/subtasks');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

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

async function insertAdmin() {
    try {
        const existingAdmin = await User.findOne({ where: { email: 'admin@gmail.com' } });

        // If admin does not exist, insert it
        if (!existingAdmin) {
            await User.create({
                email: "admin@gmail.com",
                name: "Admin",
                password: "admin", 
                birthDate: new Date().toISOString(),
                role: 'admin',
                managerId: null
            });
            console.log('Created Admin User!');
        } else {
            console.log('Admin already exists.');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            insertAdmin();
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });