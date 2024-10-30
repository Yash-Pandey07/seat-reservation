import express from 'express';
import cors from 'cors';
import { getSeats, bookSeats } from './seatsController.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Allow specific origin for CORS
const allowedOrigins = ['https://yash-pandey07.github.io/seat-reservation'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Endpoint to retrieve all seats
app.get('/api/seats', (req, res) => {
  try {
    const seats = getSeats();
    res.json(seats);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving seat data' });
  }
});

// Endpoint to book seats
app.post('/api/book', (req, res) => {
  const { numSeats } = req.body;
  if (numSeats < 1 || numSeats > 7) {
    return res.status(400).json({ error: 'You can only reserve 1 to 7 seats.' });
  }
  
  try {
    const bookedSeats = bookSeats(numSeats);
    res.json(bookedSeats);
  } catch (error) {
    res.status(500).json({ error: 'Error booking seats' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
