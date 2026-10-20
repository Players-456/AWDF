const EventEmitter = require('events');
class TaskEvents extends EventEmitter {}
const taskEvents = new TaskEvents();

// Register listeners
taskEvents.on('task-created', (task) => {
  // Simulate slow handler to demonstrate non-blocking async execution
  setTimeout(() => {
    console.log(`[Notification] Task "${task.title}" created at ${new Date().toISOString()}`);
  }, 2000);
});

taskEvents.on('task-deleted', (task) => {
  console.log(`[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`);
});

// Always register an error listener to prevent unhandled 'error' events from crashing the server
taskEvents.on('error', (err) => {
  console.error('[Event Error]', err);
});

module.exports = taskEvents;
