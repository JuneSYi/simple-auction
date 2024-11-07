import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, 'reservations.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    setupDatabase();
  }
});

const setupDatabase = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      gpuId INTEGER NOT NULL,
      color TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Failed to create reservations table', err);
      } else {
        console.log('Reservations table is ready');
      }
    }
  );

  db.run(
    `CREATE TABLE IF NOT EXISTS gpus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Failed to create GPUs table', err);
      } else {
        console.log('GPUs table is ready');
        // Optionally, populate GPUs table if empty
        db.all('SELECT COUNT(*) as count FROM gpus', (err, rows: { count: number }[]) => {
          if (err) {
            console.error('Error counting GPUs', err);
          } else if (rows[0].count === 0) {
            const stmt = db.prepare('INSERT INTO gpus (name) VALUES (?)');
            for (let i = 1; i <= 10; i++) { // Assuming 10 GPUs
              stmt.run(`GPU-${i}`);
            }
            stmt.finalize();
            console.log('GPUs table populated');
          }
        });
      }
    }
  );
};

export default db;