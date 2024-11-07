import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
    setupDatabase();
  }
});

const setupDatabase = () => {
  db.run(
    `CREATE TABLE reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      gpuIds TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error('Failed to create reservations table', err);
      } else {
        console.log('Reservations table created');
      }
    }
  );
};

export default db;