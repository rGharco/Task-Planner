/**
 * User Routes
 * Handles POST endpoints for user management
 */
const express = require('express');
const router = express.Router();
const { User } = require('../models');

/**
 * GET /api/users
 * Get all users
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'managerId']        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/users/getManagerExecutors?managerId
 * Get all executors (or subordinates) that belong to a manage
 * This is used in history for a manager to check on his subordinates
 * call example: http://localhost:3001/api/users/getManagerExecutors?managerId=3
 */
router.get('/getManagerExecutors', async (req, res) => {
    try {
        const { managerId } = req.query;

        // Validare: ne asigurăm că managerId a fost trimis
        if (!managerId) {
            return res.status(400).json({ error: 'Parametrul managerId este obligatoriu.' });
        }

        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role'],
            where: {
                managerId: managerId 
            }
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching executors:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

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

        // Return user data (excluding password) and add admin field when the admin logs in 
        res.status(200).json({
            id: user.id,
            email: user.email,
            name: user.name,
            birthDate: user.birthDate,
            role: user.role,
            managerId: user.managerId,
            isAdmin: user.role === "admin"
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
 * PUT /api/users/:id
 * Update user information
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, birthDate, email } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        await user.update({
            name: name || user.name,
            birthDate: birthDate || user.birthDate,
            email: email || user.email
        });

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            birthDate: user.birthDate,
            role: user.role,
            managerId: user.managerId
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * PUT /api/users/:id/role
 * Update user role and manager (admin only)
 */
router.put('/:id/role', async (req, res) => {
    try {
        const { id } = req.params;
        const { role, managerId } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const oldRole = user.role;

        // 1. Actualizam userul curent
        await user.update({
            role: role ?? user.role,
            managerId: managerId ?? null
        });

        // 2. Daca era manager și devine executor → curatam subordonaaii
        if (oldRole === 'manager' && role === 'executor') {
            await User.update(
                { managerId: null },
                { where: { managerId: user.id } }
            );
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            managerId: user.managerId
        });

    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;