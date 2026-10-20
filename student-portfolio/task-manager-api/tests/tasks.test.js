const request = require('supertest');
const express = require('express');
const taskRoutes = require('../routes/tasks');

const app = express();
app.use(express.json());
app.use('/tasks', taskRoutes);

describe('Tasks API', () => {
  it('GET /tasks returns 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
  });
});
