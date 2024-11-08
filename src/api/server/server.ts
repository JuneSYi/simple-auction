import express from 'express';
import cors from 'cors';
import { createReservation, getAllReservations } from './reservationsController';

const app = express();
const port = 5000;

// Single consolidated CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
  credentials: true,
  optionsSuccessStatus: 200
};
// Apply CORS middleware with options
app.use(cors(corsOptions));
app.use(express.json());

// API Endpoints
app.options('*', cors(corsOptions));
app.post('/api/reservations', createReservation);
app.get('/api/reservations', getAllReservations);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});