const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const cache = require('../cache');
const taskEvents = require('../events');

// In-memory array fallback if MongoDB is not connected
let memoryTasks = [
  { id: '1', title: 'Setup React Project', description: 'Practical 1 component architecture', completed: true, priority: 'high', createdAt: new Date() },
  { id: '2', title: 'Implement Routing & State', description: 'Practical 2 React Router & useState', completed: true, priority: 'medium', createdAt: new Date() },
  { id: '3', title: 'Build Express REST API', description: 'Practical 4 & 5 CRUD with Mongoose', completed: false, priority: 'high', createdAt: new Date() }
];

const isMongoConnected = () => {
  const mongoose = require('mongoose');
  return mongoose.connection.readyState === 1;
};

// Protect all task routes
// router.use(auth);

// ── Supplementary: Route-specific middleware to validate Task ID ─────────────
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: 'Task ID is required' });

  if (isMongoConnected()) {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Task ID format (must be a valid ObjectId)' });
    }
  } else {
    // Fallback format (alphanumeric for Date.now() or static IDs)
    if (!/^[a-zA-Z0-9]+$/.test(id)) {
      return res.status(400).json({ error: 'Invalid Task ID format' });
    }
  }
  next();
};

// ── GET /tasks/cache-stats - Debug endpoint for cache stats ──────────────────
router.get('/cache-stats', (req, res) => {
  res.json(cache.getStats());
});

// ── GET /tasks - Get all tasks ───────────────────────────────────────────────
router.get('/', async (req, res, next) => {
  try {
    const cached = cache.get('all_tasks');
    if (cached) return res.status(200).json(cached);

    if (isMongoConnected()) {
      const tasks = await Task.find().sort({ createdAt: -1 });
      cache.set('all_tasks', tasks);
      return res.status(200).json(tasks);
    }
    cache.set('all_tasks', memoryTasks);
    return res.status(200).json(memoryTasks);
  } catch (err) {
    next(err);
  }
});

// ── GET /tasks/:id - Get single task by ID (Practical 5 Supplementary) ─────────
router.get('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const cacheKey = `task_${id}`;
    const cached = cache.get(cacheKey);
    if (cached) return res.status(200).json(cached);

    if (isMongoConnected()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      cache.set(cacheKey, task);
      return res.status(200).json(task);
    }

    const task = memoryTasks.find(t => t.id === id);
    if (!task) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }
    cache.set(cacheKey, task);
    return res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ── POST /tasks - Create new task ─────────────────────────────────────────────
router.post('/', async (req, res, next) => {
  try {
    const { title, description, completed, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required and cannot be empty' });
    }

    if (isMongoConnected()) {
      const newTask = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        completed: Boolean(completed),
        priority: priority || 'medium'
      });
      cache.del('all_tasks');
      console.log(`[API] Response sent at ${new Date().toISOString()}`);
      res.status(201).json(newTask);
      return taskEvents.emit('task-created', newTask);
    }

    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description ? description.trim() : '',
      completed: Boolean(completed),
      priority: priority || 'medium',
      createdAt: new Date()
    };
    memoryTasks.push(newTask);
    cache.del('all_tasks');
    console.log(`[API] Response sent at ${new Date().toISOString()}`);
    res.status(201).json(newTask);
    return taskEvents.emit('task-created', newTask);
  } catch (err) {
    next(err);
  }
});

// ── PUT /tasks/:id - Update existing task ────────────────────────────────────
router.put('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;

    if (isMongoConnected()) {
      const updateData = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description.trim();
      if (completed !== undefined) updateData.completed = Boolean(completed);
      if (priority !== undefined) updateData.priority = priority;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      cache.del('all_tasks');
      cache.del(`task_${id}`);
      return res.status(200).json(updatedTask);
    }

    const taskIndex = memoryTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    memoryTasks[taskIndex] = {
      ...memoryTasks[taskIndex],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(completed !== undefined && { completed: Boolean(completed) }),
      ...(priority !== undefined && { priority })
    };

    cache.del('all_tasks');
    cache.del(`task_${id}`);
    return res.status(200).json(memoryTasks[taskIndex]);
  } catch (err) {
    next(err);
  }
});

// ── DELETE /tasks/:id - Delete a task ─────────────────────────────────────────
router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ error: `Task with ID ${id} not found` });
      }
      cache.del('all_tasks');
      cache.del(`task_${id}`);
      res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
      return taskEvents.emit('task-deleted', deletedTask);
    }

    const taskIndex = memoryTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      return res.status(404).json({ error: `Task with ID ${id} not found` });
    }

    const deleted = memoryTasks.splice(taskIndex, 1)[0];
    cache.del('all_tasks');
    cache.del(`task_${id}`);
    res.status(200).json({ message: 'Task deleted successfully', task: deleted });
    return taskEvents.emit('task-deleted', deleted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
