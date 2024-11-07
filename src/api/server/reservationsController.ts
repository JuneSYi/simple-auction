import { Request, Response } from 'express';
import db from './db';

// Create a reservation
export const createReservation = (req: Request, res: Response) => {
  const { customer, startDate, endDate, gpuIds, color } = req.body;

  if (!customer || !startDate || !endDate || !gpuIds || !color) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  const gpuIdArray = Array.isArray(gpuIds) ? gpuIds : [gpuIds];

  db.serialize(() => {
    const placeholders = gpuIdArray.map(() => '?').join(',');
    const query = `SELECT * FROM reservations WHERE gpuId IN (${placeholders}) AND (
      (date(startDate) <= date(?) AND date(endDate) >= date(?)) OR
      (date(startDate) <= date(?) AND date(endDate) >= date(?))
    )`;

    db.all(query, [...gpuIdArray, endDate, startDate, startDate, endDate], (err, rows) => {
      if (err) {
        res.status(500).json({ error: 'Failed to check conflicts' });
      } else if (rows.length > 0) {
        res.status(409).json({ error: 'Conflicting reservation' });
      } else {
        const insertStmt = db.prepare(`INSERT INTO reservations (customer, startDate, endDate, gpuId, color) VALUES (?, ?, ?, ?, ?)`);
        gpuIdArray.forEach((gpuId: number) => {
          insertStmt.run([customer, startDate, endDate, gpuId, color], (err) => {
            if (err) {
              console.error('Failed to create reservation', err);
              res.status(500).json({ error: 'Failed to create reservation' });
            }
          });
        });
        insertStmt.finalize(() => {
          res.status(201).json({ message: 'Reservation created successfully' });
        });
      }
    });
  });
};

// Get all reservations
export const getAllReservations = (req: Request, res: Response) => {
  db.all('SELECT * FROM reservations', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Failed to fetch reservations' });
    } else {
      res.json(rows);
    }
  });
};