// db.js
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './data/robots.sqlite';
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new Database(DB_PATH);

// Initialize tables
db.exec(`
CREATE TABLE IF NOT EXISTS robots (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  status TEXT,
  battery INTEGER DEFAULT 100,
  location TEXT,
  mode TEXT,
  error TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS logs (
  id TEXT PRIMARY KEY,
  robot_id TEXT,
  level TEXT,
  message TEXT,
  meta TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(robot_id) REFERENCES robots(id) ON DELETE CASCADE
);
`);

module.exports = db;
