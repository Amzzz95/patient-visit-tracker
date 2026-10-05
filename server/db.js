import Database from "better-sqlite3";

const db = new Database(process.env.DB_FILE || "visits.db");
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS clinicians (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT
);
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  date_of_birth TEXT
);
CREATE TABLE IF NOT EXISTS visits (
  id INTEGER PRIMARY KEY,
  clinician_id INTEGER NOT NULL REFERENCES clinicians(id),
  patient_id INTEGER NOT NULL REFERENCES patients(id),
  visited_at TEXT NOT NULL,   -- local timezone datetime in YYYY-MM-DDTHH:mm format
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
`);

export default db;
