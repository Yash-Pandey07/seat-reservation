import express from 'express';
import cors from 'cors';
import { getSeats, bookSeats } from './seatsController.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/seats', (req, res) => {
  res.json(getSeats());
});

app.post('/api/book', (req, res) => {
  const { numSeats } = req.body;
  if (numSeats < 1 || numSeats > 7) {
    return res.status(400).json({ error: 'You can only reserve 1 to 7 seats.' });
  }
  const bookedSeats = bookSeats(numSeats);
  res.json(bookedSeats);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
