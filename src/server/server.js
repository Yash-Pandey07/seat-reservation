import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { getSeats, bookSeats, resetSeats } from './seatsController.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allow specific origin for CORS
const allowedOrigins = [
  'https://yash-pandey07.github.io',
  // 'http://localhost:5173',
  // 'https://seat-reservation-6bbv.onrender.com',
];

app.options('*', cors());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Endpoint to retrieve all seats
app.get('/api/seats', (req, res) => {
  try {
    const seats = getSeats();
    res.json(seats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving seat data' });
  }
});

// Endpoint to book seats
app.post('/api/book', (req, res) => {
  const { numSeats } = req.body;

  if (typeof numSeats !== 'number' || numSeats < 1 || numSeats > 7) {
    return res.status(400).json({ error: 'You can only reserve 1 to 7 seats.' });
  }

  try {
    const bookedSeats = bookSeats(numSeats);
    res.json(bookedSeats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error booking seats' });
  }
});

// Endpoint to reset all seats
app.post('/api/reset', (req, res) => {
  try {
    resetSeats();
    res.json({ message: 'All seats have been reset to unbooked' });
  } catch (error) {
    console.error('Error resetting seats:', error);
    res.status(500).json({ error: 'Error resetting seats' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
