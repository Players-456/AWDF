import { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  AlertTriangle, 
  Loader2, 
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { getTasks, createTask, updateTask, deleteTask, generateAiDescription } from '../services/api';
import { Sparkles } from 'lucide-react';
import Auth from './Auth';
import { LogOut } from 'lucide-react';

const INITIAL_FORM = {
  title: '',
  description: '',
  priority: 'medium'
};

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  // Fetch tasks on component mount
  const fetchTaskList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTasks();
      // Handle both MongoDB array and fallback format
      setTasks(Array.isArray(data) ? data : data.value || []);
    } catch (err) {
      if (err.message.includes('Authentication failed') || err.message.includes('token')) {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
      setError(err.message || 'Unable to connect to Task API (Port 5000)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchTaskList();
    }
  }, [isAuthenticated]);

  const showToast = (msg, type = 'success') => {
    setActionMessage({ text: msg, type });
    setTimeout(() => {
      setActionMessage(null);
    }, 3500);
  };

  const handleGenerateAiDescription = async () => {
    if (!form.title.trim()) {
      showToast('Please enter a task title first', 'error');
      return;
    }
    try {
      setIsGeneratingAi(true);
      const res = await generateAiDescription(form.title);
      if (res.description) {
        setForm(prev => ({ ...prev, description: res.description }));
        showToast('AI description generated!', 'success');
      } else if (res.fallback) {
        showToast('AI feature unavailable, using fallback', 'error');
      }
    } catch (err) {
      showToast('Failed to generate AI description', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Create Task (POST /tasks)
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      setIsSubmitting(true);
      const newTask = await createTask({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        completed: false
      });

      // Update state immediately
      setTasks((prev) => [newTask, ...prev]);
      setForm(INITIAL_FORM);
      showToast('Task added successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to add task', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Complete Status (PUT /tasks/:id)
  const handleToggleComplete = async (task) => {
    const taskId = task._id || task.id;
    const targetStatus = !task.completed;

    try {
      // Optimistic state update
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? { ...t, completed: targetStatus } : t))
      );

      await updateTask(taskId, { completed: targetStatus });
      showToast(`Task marked as ${targetStatus ? 'completed' : 'pending'}`);
    } catch (err) {
      // Revert if API call fails
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? { ...t, completed: !targetStatus } : t))
      );
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  // Delete Task (DELETE /tasks/:id)
  const handleDeleteTask = async (task) => {
    const taskId = task._id || task.id;
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) return;

    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== taskId));
      showToast('Task deleted successfully');
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setTasks([]);
  };

  if (!isAuthenticated) {
    return <Auth onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="tasks-page animate-fade-in delay-1" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Task Management
          </h2>
          <p style={{ color: 'var(--text-muted, #94a3b8)', marginTop: '6px', fontSize: '1rem' }}>
            Organize, track, and manage your daily tasks in real time
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={fetchTaskList} 
            className="submit-btn" 
            style={{ width: 'auto', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            Refresh
          </button>
          <button 
            onClick={handleLogout} 
            className="submit-btn" 
            style={{ width: 'auto', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#f87171' }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div 
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: actionMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
            border: `1px solid ${actionMessage.type === 'error' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
            color: actionMessage.type === 'error' ? '#f87171' : '#4ade80',
            fontWeight: 500
          }}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Task Creation Form */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} color="var(--primary-color, #6366f1)" />
          Add New Task
        </h3>
        
        <form onSubmit={handleCreateTask} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="title">Task Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Design Landing Page"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              className="form-input"
              value={form.priority}
              onChange={handleInputChange}
              style={{ background: 'rgba(15, 23, 42, 0.6)' }}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1', margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label htmlFor="description" style={{ margin: 0 }}>Description (Optional)</label>
              <button 
                type="button" 
                onClick={handleGenerateAiDescription} 
                disabled={isGeneratingAi || !form.title.trim()}
                style={{ background: 'transparent', border: '1px solid #6366f1', color: '#6366f1', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
              >
                {isGeneratingAi ? <Loader2 size={14} className="spinner" /> : <Sparkles size={14} />}
                Generate with AI
              </button>
            </div>
            <input
              id="description"
              name="description"
              type="text"
              className="form-input"
              placeholder="Provide details or notes for this task..."
              value={form.description}
              onChange={handleInputChange}
            />
            <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
              AI-generated content should be reviewed before saving.
            </small>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting || !form.title.trim()}
              style={{ width: 'auto', minWidth: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner" /> Creating...
                </>
              ) : (
                <>
                  <PlusCircle size={18} /> Create Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Task List Section */}
      {loading ? (
        <div className="projects-state-container" style={{ padding: '3rem' }}>
          <Loader2 className="spinner" size={42} />
          <p>Loading tasks...</p>
        </div>
      ) : error ? (
        <div className="projects-state-container error" style={{ padding: '2rem' }}>
          <AlertTriangle size={42} className="error-icon" />
          <h3>Could not load tasks</h3>
          <p>{error}</p>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
            Ensure the backend server is running on port 5000.
          </p>
          <button onClick={fetchTaskList} className="submit-btn" style={{ marginTop: '1rem', width: 'auto' }}>
            Retry Connection
          </button>
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          <Layers size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No tasks found</h3>
          <p>Use the form above to add your first task.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {tasks.map((task) => {
            const taskId = task._id || task.id;
            const priorityColors = {
              high: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.4)' },
              medium: { bg: 'rgba(234, 179, 8, 0.15)', text: '#facc15', border: 'rgba(234, 179, 8, 0.4)' },
              low: { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.4)' }
            };
            const pStyle = priorityColors[task.priority] || priorityColors.medium;

            return (
              <div 
                key={taskId} 
                className="glass-card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  opacity: task.completed ? 0.75 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Checkbox Toggle Button */}
                <button
                  onClick={() => handleToggleComplete(task)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: task.completed ? '#4ade80' : '#64748b',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                >
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>

                {/* Task Details */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h4 
                      style={{ 
                        margin: 0, 
                        fontSize: '1.1rem',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? '#94a3b8' : '#f8fafc'
                      }}
                    >
                      {task.title}
                    </h4>
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        background: pStyle.bg,
                        color: pStyle.text,
                        border: `1px solid ${pStyle.border}`,
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}
                    >
                      {task.priority || 'medium'}
                    </span>
                  </div>

                  {task.description && (
                    <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                      {task.description}
                    </p>
                  )}

                  {task.createdAt && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                      <Clock size={12} />
                      {new Date(task.createdAt).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteTask(task)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    padding: '8px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

export default TaskManager;
