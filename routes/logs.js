// routes/logs.js
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();

// Create a log for a robot
router.post('/robots/:id/logs', (req, res) => {
  const robotId = req.params.id;
  const { level = 'info', message, meta } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  const robot = db.prepare('SELECT id FROM robots WHERE id = ?').get(robotId);
  if (!robot) return res.status(404).json({ error: 'Robot not found' });

  const id = uuidv4();
  const stmt = db.prepare(`INSERT INTO logs (id, robot_id, level, message, meta) VALUES (?, ?, ?, ?, ?)`);
  try {
    stmt.run(id, robotId, level, message, meta ? JSON.stringify(meta) : null);
    const log = db.prepare('SELECT * FROM logs WHERE id = ?').get(id);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create log', details: err.message });
  }
});

// Get logs for robot
router.get('/robots/:id/logs', (req, res) => {
  const robotId = req.params.id;
  const robot = db.prepare('SELECT id FROM robots WHERE id = ?').get(robotId);
  if (!robot) return res.status(404).json({ error: 'Robot not found' });

  const logs = db.prepare('SELECT * FROM logs WHERE robot_id = ? ORDER BY created_at DESC').all(robotId);
  res.json(logs);
});

// General logs listing (with optional robot_id filter)
router.get('/logs', (req, res) => {
  const robotId = req.query.robot_id;
  let rows;
  if (robotId) {
    rows = db.prepare('SELECT * FROM logs WHERE robot_id = ? ORDER BY created_at DESC').all(robotId);
  } else {
    rows = db.prepare('SELECT * FROM logs ORDER BY created_at DESC').all();
  }
  res.json(rows);
});

module.exports = router;
