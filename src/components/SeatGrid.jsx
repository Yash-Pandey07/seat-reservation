import React from 'react';
import './SeatGrid.css';

const SeatGrid = ({ seats }) => {
  const rows = Array.from(new Set(seats.map(seat => seat.row)));

  return (
    <div className="seat-grid">
      {rows.map(row => (
        <div key={row} className="row">
          {seats
            .filter(seat => seat.row === row)
            .map(seat => (
              <div
                key={seat.id}
                className={`seat ${seat.booked ? 'booked' : 'available'}`}
              >
                {seat.row}-{seat.column}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default SeatGrid;
