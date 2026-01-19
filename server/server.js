const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

// Middleware to get task by ID
async function getTask(req, res, next) {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Task not found' });
    res.task = rows[0];
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Routes
app.get('/tasks', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");
    console.log('Raw tasks from DB:', rows);
    const tasksWithId = rows.map(task => ({ ...task, _id: task.id }));
    console.log('Tasks with _id:', tasksWithId);
    res.json(tasksWithId);
  } catch (err) {
    console.error('Error in GET /tasks:', err);
    res.status(500).json({ message: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags, estimatedTime } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const [result] = await pool.query(
      "INSERT INTO tasks (title, description, status, priority, dueDate, tags, estimatedTime, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [title, description || '', status || 'todo', priority || 'medium', dueDate || null, tags || '', estimatedTime || 0]
    );
    const [newTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [result.insertId]);
    const taskWithId = { ...newTask[0], _id: newTask[0].id };
    res.status(201).json(taskWithId);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/tasks/:id', getTask, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, tags, estimatedTime, timeSpent } = req.body;
    await pool.query(
      "UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, tags = ?, estimatedTime = ?, timeSpent = ?, updatedAt = NOW() WHERE id = ?",
      [
        title !== undefined ? title : res.task.title,
        description !== undefined ? description : res.task.description,
        status !== undefined ? status : res.task.status,
        priority !== undefined ? priority : res.task.priority,
        dueDate !== undefined ? dueDate : res.task.dueDate,
        tags !== undefined ? tags : res.task.tags,
        estimatedTime !== undefined ? estimatedTime : res.task.estimatedTime,
        timeSpent !== undefined ? timeSpent : res.task.timeSpent,
        req.params.id
      ]
    );
    const [updatedTask] = await pool.query("SELECT * FROM tasks WHERE id = ?", [req.params.id]);
    const taskWithId = { ...updatedTask[0], _id: updatedTask[0].id };
    res.json(taskWithId);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/tasks/:id', getTask, async (req, res) => {
  try {
    await pool.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
