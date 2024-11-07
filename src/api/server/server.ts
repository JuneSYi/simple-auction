import express from 'express';
import cors from 'cors';
import { createReservation, getAllReservations } from './reservationsController';

const app = express();
const port = 5000;

// Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200 // Handle OPTIONS preflight request
}));
app.use(express.json());

// API Endpoints
app.options('/api/reservations', cors()); // Handle OPTIONS for preflight
app.post('/api/reservations', createReservation);
app.get('/api/reservations', getAllReservations);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});