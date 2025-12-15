/**
 * Task Routes
 * Handles POST endpoints for task management
 */
const express = require('express');
const router = express.Router();
const { Task, User, TaskAssignment, Subtask } = require('../models');

/**
 * POST /api/tasks
 * Create a new task
 * Body: { title, description, deadline, category, createdById }
 */
router.post('/', async (req, res) => {
    try {
        const { title, description, deadline, category, createdById } = req.body;

        // Validate required fields
        if (!title || !createdById) {
            return res.status(400).json({ 
                error: 'Missing required fields: title, createdById' 
            });
        }

        // Verify creator exists and is a manager or admin
        const creator = await User.findByPk(createdById);
        if (!creator) {
            return res.status(404).json({ error: 'Creator user not found' });
        }
        if (creator.role === 'executor') {
            return res.status(403).json({ error: 'Only managers and admins can create tasks' });
        }

        const task = await Task.create({
            title,
            description: description || null,
            status: 'OPEN',
            deadline: deadline || null,
            category: category || null,
            createdById
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/tasks/:id/assign
 * Assign users to a task (changes status to PENDING)
 * Body: { assignees: [{ userId, role (optional) }] }
 */
router.post('/:id/assign', async (req, res) => {
    try {
        const { id } = req.params;
        const { assignees } = req.body;

        // Validate input
        if (!assignees || !Array.isArray(assignees) || assignees.length === 0) {
            return res.status(400).json({ error: 'Assignees array is required' });
        }

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Create assignments for each user
        const assignments = [];
        for (const assignee of assignees) {
            const user = await User.findByPk(assignee.userId);
            if (!user) {
                return res.status(404).json({ error: `User ${assignee.userId} not found` });
            }

            const assignment = await TaskAssignment.create({
                taskId: id,
                userId: assignee.userId,
                role: assignee.role || null
            });
            assignments.push(assignment);
        }

        // Update task status to PENDING
        task.status = 'PENDING';
        await task.save();

        res.status(201).json({ task, assignments });
    } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/tasks/:id/complete
 * Mark a task as completed (executor action)
 */
router.post('/:id/complete', async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.status !== 'PENDING') {
            return res.status(400).json({ error: 'Only PENDING tasks can be marked as completed' });
        }

        task.status = 'COMPLETED';
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/tasks/:id/close
 * Close a completed task (manager action)
 */
router.post('/:id/close', async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findByPk(id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        if (task.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Only COMPLETED tasks can be closed' });
        }

        task.status = 'CLOSED';
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        console.error('Error closing task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;