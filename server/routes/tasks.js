/**
 * Task Routes
 * Handles POST endpoints for task management
 */
const express = require('express');
const router = express.Router();
const { Task, User, TaskAssignment, Subtask } = require('../models');
const e = require('express');
const { Op } = require('sequelize');

/**
 * GET /api/tasks
 * Request all the tasks or the task based on a date (used on the dashboard page to retrieve weekly tasks)
 * Query parameters: startDate, endDate (tasks?startDate=<X>&endDate=<X>)
 */
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let tasks;

        if (startDate && endDate) {
            // Filtrare pe interval de date
            tasks = await Task.findAll({
                where: {
                    deadline: {
                        [Op.between]: [new Date(startDate), new Date(endDate)]
                    }
                }
            });
        } else {
            // Dacă nu avem parametri, limităm la ultimele 100
            tasks = await Task.findAll({ limit: 100 });
        }

        return res.status(200).json(tasks || []);
    }
    catch(err) {
        return res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /api/tasks/userHistory
 * Request all the tasks or the task based on a date and based on user (used in history page to display tasks)
 * Query parameters: startDate, endDate (tasks?userId=<x>&startDate=<X>&endDate=<X>)
 */
router.get('/userHistory', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'userId query parameter is required' });
        }

        // 1. Luam email-ul userului
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userEmail = user.email;

        // 2. Construim whereClause
        const whereClause = {
            [Op.or]: [
                { creatorId: userId },        // taskurile in care e asignee
                { asigneeId: userId }       // taskurile in care e executor
            ]
        };

        // 3. Query final
        const tasks = await Task.findAll({
            where: whereClause,
            order: [['deadline', 'DESC']],
        });

        return res.status(200).json(tasks || []);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
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

/**
 * PUT /api/completeTask/:id/
 * Complete a task as the person who executes it, used in profile section
 * 
 */
router.put('/completeTask/:id', async (req, res) => {
    try {
        const taskId = Number(req.params.id);

        if (taskId < 0) {
            return res.status(400).json({
                message: 'task id cannot be lower than 0'
            });
        }

        const toUpdate = await Task.findOne({
            where: { id: taskId }
        });

        if (!toUpdate) {
            return res.status(404).json({
                message: 'task does not exist'
            });
        }

        const {
            title,
            description,
            status,
            deadline,
            category
        } = req.body;

        await toUpdate.update({
            title: title ?? toUpdate.title,
            description: description ?? toUpdate.description,
            status: status ?? toUpdate.status,
            deadline: deadline ?? toUpdate.deadline,
            category: category ?? toUpdate.category
        });

        return res.status(200).json({
            message: 'updated'
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: `Server error: ${error}`
        });
    }
});

router.put('/modify/:id', async (req, res) => {
    try {
        const taskId = req.params.id;

        if (taskId < 0) {
            return res.status(400).json({"message": "task id cannot be lower than 0"});
        }

        const toUpdate = await Task.findOne({
            where: {id : taskId}
        });

        if (!toUpdate) {
            return res.status(400).json({"message": "task does not exist"});
        }

        const JSONBody = req.body;

        // Frontend will send the data already present so no fields will be left NULL
        toUpdate.update({
            title: JSONBody.title,
            description: JSONBody.description,
            status: JSONBody.status,
            deadline: JSONBody.deadline,
            category: JSONBody.category
        });

        return res.status(200).json({"message": "updated"});
    }
    catch(error) {
        console.error(error);
        return res.status(500).json({ error: `Sevrer error: ${error}` });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const taskId = req.params.id;

        if (taskId < 0) {
            return res.status(400).json({"message": "task id cannot be lower than 0"});
        }

        const toDelete = await Task.findOne({
            where: {id : taskId}
        });

        if (!toDelete) {
            return res.status(400).json({"message": "task does not exist"});
        }

        await toDelete.destroy();

        return res.status(200).json({ "message": "deleted" });
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/tasks/created/:userId
 * Get all tasks created by a specific user
 */
router.get('/created/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.findAll({
            where: { creatorId: userId }
        });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching created tasks:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

/**
 * GET /api/tasks/assigned/:userId
 * Get all tasks assigned to a specific user
 */
router.get('/assigned/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const tasks = await Task.findAll({
            where: { asigneeId: userId }
        });
        return res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching assigned tasks:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, executor, asigneeId, deadline, description, category, creatorId } = req.body;
        let task;

        if (title.trim().length === 0) {
            return res.status(400).json({
                error: 'Missing required fields: title'
            });
        }

        task = await Task.create({
            title,
            description: description || null,
            status: asigneeId ? 'PENDING' : 'OPEN',
            executor: executor || null,
            asigneeId: asigneeId || null,
            deadline: deadline || null,
            category: category || null,
            creatorId: creatorId || null,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router;