const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// ── 1. Global Middleware Pipeline ───────────────────────────────────────────
// CORS middleware for full-stack frontend communication
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Request logging middleware (Practical 4 requirement)
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Supplementary middleware: Validate Content-Type for POST/PUT requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Invalid Content-Type header. Expected application/json'
      });
    }
  }
  next();
});

// ── 2. Health & Base Route ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Task Manager REST API (Practicals 4 & 5)',
    endpoints: {
      getAllTasks: 'GET /tasks',
      getTaskById: 'GET /tasks/:id',
      createTask: 'POST /tasks',
      updateTask: 'PUT /tasks/:id',
      deleteTask: 'DELETE /tasks/:id'
    }
  });
});

// ── 3. Application Routes ────────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// ── 4. 404 Route Handler for undefined routes ────────────────────────────────
app.use((req, res, next) => {
  res.status(404).json({
    error: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ── 5. Global Error Handling Middleware (Must be last) ──────────────────────
app.use((err, req, res, next) => {
  console.error('[Error Handler]:', err.message || err);

  // Mongoose Validation Error handling (Practical 5)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: messages
    });
  }

  // Mongoose Bad ObjectId / CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: `Invalid format for field: ${err.path}`
    });
  }

  // Generic 500 server error
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

// ── 6. Database Connection & Server Initialization ───────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection failed, running in in-memory fallback mode:', err.message);
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Task Manager API running on http://localhost:${PORT}`);
    });
  });
