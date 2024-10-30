import React, { useState, useEffect } from 'react';
import SeatGrid from './components/SeatGrid';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://seat-reservation-6bbv.onrender.com';  // Use Render URL here
//const API_BASE_URL = 'http://localhost:3001';

const App = () => {
  const [seats, setSeats] = useState([]);
  const [numSeatsToBook, setNumSeatsToBook] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/seats`);
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const handleBookSeats = async () => {
    setErrorMessage('');

    // Validate numSeats before making the request
    if (numSeatsToBook < 1 || numSeatsToBook > 7) {
      setErrorMessage('You can only reserve between 1 and 7 seats.'); // Set error message
      return; // Stop the function here
    }

     // Check for available seats
     const seatsToBook = Number(numSeatsToBook);
     const availableSeats = seats.filter(seat => !seat.booked);
     if (availableSeats.length < seatsToBook) {
       setErrorMessage('No seats are left to book.');
       return;
     }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/book`, { numSeats: numSeatsToBook });
      setBookedSeats(response.data);
      fetchSeats();
      //setNumSeatsToBook(0);
    } catch (error) {
      console.error('Error booking seats:', error);
    }
  };

  const resetSeats = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/reset`);
      if (response.status === 200) {
        alert(response.data.message);
        fetchSeats();
      } else {
        alert('Error resetting seats');
      }
    } catch (error) {
      console.error('Error resetting seats:', error);
    }
  };

  return (
    <div className="App">
      <h1>Train Seat Reservation</h1>
      <input
        type="number"
        value={numSeatsToBook}
        onChange={(e) => setNumSeatsToBook(Number(e.target.value)) }
        placeholder="Enter seats to book"
      />
      <button onClick={handleBookSeats}>Book Seats</button>
      <button onClick={resetSeats}>Reset All Seats</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <SeatGrid seats={seats} />
      <h3>Booked Seats: {bookedSeats.map(seat => `Row ${seat.row} - Seat ${seat.column}`).join(', ')}</h3>
    </div>
  );
};

export default App;