
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();


router.post('/', (req, res) => {
  const { id, name, type, status } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  const rid = id || uuidv4();
  const stmt = db.prepare(`INSERT INTO robots (id, name, type, status) VALUES (?, ?, ?, ?)`);
  try {
    stmt.run(rid, name, type || null, status || 'idle');
    const robot = db.prepare('SELECT * FROM robots WHERE id = ?').get(rid);
    return res.status(201).json(robot);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create robot', details: err.message });
  }
});


router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { battery, location, mode, error } = req.body;
  const robot = db.prepare('SELECT * FROM robots WHERE id = ?').get(id);
  if (!robot) return res.status(404).json({ error: 'Robot not found' });

  const updateStmt = db.prepare(`
    UPDATE robots SET
      battery = COALESCE(?, battery),
      location = COALESCE(?, location),
      mode = COALESCE(?, mode),
      error = COALESCE(?, error)
    WHERE id = ?
  `);
  try {
    updateStmt.run(
      battery !== undefined ? battery : null,
      location !== undefined ? location : null,
      mode !== undefined ? mode : null,
      error !== undefined ? error : null,
      id
    );
    const updated = db.prepare('SELECT * FROM robots WHERE id = ?').get(id);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update robot', details: err.message });
  }
});


router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM robots ORDER BY created_at DESC').all();
  res.json(rows);
});


router.get('/:id', (req, res) => {
  const robot = db.prepare('SELECT * FROM robots WHERE id = ?').get(req.params.id);
  if (!robot) return res.status(404).json({ error: 'Robot not found' });
  res.json(robot);
});

module.exports = router;
