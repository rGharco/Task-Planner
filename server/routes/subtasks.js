/**
 * Subtask Routes
 * Handles POST endpoints for subtask management
 */
const express = require('express');
const router = express.Router();
const { Subtask, Task, User } = require('../models');

/**
 * POST /api/subtasks
 * Create a new subtask for a task
 * Body: { taskId, description, deadline, assignedToId (optional) }
 */
router.post('/', async (req, res) => {
    try {
        const { taskId, description, deadline, assignedToId } = req.body;

        // Validate required fields
        if (!taskId || !description) {
            return res.status(400).json({ 
                error: 'Missing required fields: taskId, description' 
            });
        }

        // Verify parent task exists
        const task = await Task.findByPk(taskId);
        if (!task) {
            return res.status(404).json({ error: 'Parent task not found' });
        }

        // If assignedToId provided, verify user exists
        if (assignedToId) {
            const user = await User.findByPk(assignedToId);
            if (!user) {
                return res.status(404).json({ error: 'Assigned user not found' });
            }
        }

        const subtask = await Subtask.create({
            taskId,
            description,
            deadline: deadline || null,
            assignedToId: assignedToId || null,
            status: 'OPEN'
        });

        res.status(201).json(subtask);
    } catch (error) {
        console.error('Error creating subtask:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/subtasks/:id/complete
 * Mark a subtask as completed
 */
router.post('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;

        const subtask = await Subtask.findByPk(id);
        if (!subtask) {
            return res.status(404).json({ error: 'Subtask not found' });
        }

        subtask.status = 'COMPLETED';
        await subtask.save();

        res.status(200).json(subtask);
    } catch (error) {
        console.error('Error completing subtask:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;