/**
 * User Routes
 * Handles POST endpoints for user management
 */
const express = require('express');
const router = express.Router();
const { User } = require('../models');

/**
 * POST /api/users
 * Create a new user (Register)
 * Body: { email, name, password, birthDate, role, managerId (optional) }
 */
router.post('/', async (req, res) => {
    try {
        const { email, name, password, birthDate, role, managerId } = req.body;

        // Validate required fields
        if (!email || !name || !password) {
            return res.status(400).json({
                error: 'Missing required fields: email, name, password'
            });
        }

        // If managerId provided, verify the manager exists
        if (managerId) {
            const manager = await User.findByPk(managerId);
            if (!manager) {
                return res.status(404).json({ error: 'Manager not found' });
            }
        }

        const user = await User.create({
            email,
            name,
            password,
            birthDate: birthDate || null,
            role: role || 'executor',
            managerId: managerId || null
        });

        res.status(201).json(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/users/login
 * Login user
 * Body: { email, password }
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                error: 'Missing required fields: email, password'
            });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password (simple comparison - in production, use bcrypt)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user data (excluding password)
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            birthDate: user.birthDate,
            role: user.role,
            managerId: user.managerId
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/users/:id/assign-manager
 * Assign a manager to an executor
 * Body: { managerId }
 */
router.post('/:id/assign-manager', async (req, res) => {
    try {
        const { id } = req.params;
        const { managerId } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const manager = await User.findByPk(managerId);
        if (!manager) {
            return res.status(404).json({ error: 'Manager not found' });
        }

        user.managerId = managerId;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error assigning manager:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/users
 * Get all users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/users
 * Get all users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;