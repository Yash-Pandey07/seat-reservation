import React, { useState, useEffect } from 'react';
import SeatGrid from './components/SeatGrid';
import axios from 'axios';
import './App.css';

const App = () => {
  const [seats, setSeats] = useState([]);
  const [numSeatsToBook, setNumSeatsToBook] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/seats');
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const handleBookSeats = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/book', { numSeats: numSeatsToBook });
      setBookedSeats(response.data);
      fetchSeats(); // Refresh seats after booking
    } catch (error) {
      console.error('Error booking seats:', error);
    }
  };

  return (
    <div className="App">
      <h1>Train Seat Reservation</h1>
      <input
        type="number"
        value={numSeatsToBook}
        onChange={e => setNumSeatsToBook(Number(e.target.value))}
        placeholder="Enter seats to book"
      />
      <button onClick={handleBookSeats}>Book Seats</button>
      <SeatGrid seats={seats} />
      <h3>Booked Seats: {bookedSeats.map(seat => `Row ${seat.row} - Seat ${seat.column}`).join(', ')}</h3>
    </div>
  );
};

export default App;
