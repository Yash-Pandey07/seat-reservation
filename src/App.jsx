import React, { useState, useEffect } from 'react';
import SeatGrid from './components/SeatGrid';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://seat-reservation-6bbv.onrender.com';
//const API_BASE_URL = 'http://localhost:3001';

const App = () => {
  const [seats, setSeats] = useState([]);
  const [numSeatsToBook, setNumSeatsToBook] = useState(0);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBackendDown, setIsBackendDown] = useState(false);

  useEffect(() => {
    checkBackendStatus();
    fetchSeats();
  }, []);

   // Check server status to display the banner if the backend is down
   const checkBackendStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/seats`);
      if (response.status === 200) setIsBackendDown(false);
    } catch (error) {
      console.error('Backend may be offline:', error);
      setIsBackendDown(true);
    }
  };

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
      setNumSeatsToBook(0);
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
      {isBackendDown && (
        <div className="banner">
          <p>
            <strong>Notice:</strong> If seat information is not displayed, our backend server may be temporarily offline. Please feel free to reach out so we can promptly address the issue.
            <br />
            Connect with me on{' '}
            <a href="https://github.com/Yash-Pandey07" target="_blank" rel="noopener noreferrer">GitHub</a> or{' '}
            <a href="https://www.linkedin.com/in/yashpandey7/" target="_blank" rel="noopener noreferrer">LinkedIn</a> for updates and support.
          </p>
        </div>
      )}
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
      <div className="footer">
          <p>
          <strong>Notice:</strong> Seat information may take a moment to load as our backend server response is currently delayed. If you don’t see the seat details within a minute, please feel free to reach out. We’re here to assist you!
            <br />
            Connect with me on{' '}
            <a href="https://github.com/Yash-Pandey07" target="_blank" rel="noopener noreferrer">GitHub</a> or{' '}
            <a href="https://www.linkedin.com/in/yashpandey7/" target="_blank" rel="noopener noreferrer">LinkedIn</a> for updates and support.
          </p>
        </div>
    </div>
  );
};

export default App;