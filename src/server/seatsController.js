import fs from 'fs';
import path from 'path';

// Directly reference db.json in the same directory
const dbFilePath = path.join(path.resolve(), 'src', 'server', 'db.json');

export function getSeats() {
  const db = JSON.parse(fs.readFileSync(dbFilePath));
  return db.seats;
}

export function bookSeats(numSeats) {
  const seats = getSeats();
  const bookedSeats = [];
  let seatsToBook = numSeats;

  for (let row = 0; row < seats.length && seatsToBook > 0; row++) {
    const freeSeats = seats.filter(seat => !seat.booked && seat.row === row + 1);
    
    if (freeSeats.length >= seatsToBook) {
      freeSeats.slice(0, seatsToBook).forEach(seat => {
        seat.booked = true;
        bookedSeats.push(seat);
      });
      seatsToBook = 0;
    }
  }

  if (seatsToBook > 0) {
    seats.filter(seat => !seat.booked).slice(0, seatsToBook).forEach(seat => {
      seat.booked = true;
      bookedSeats.push(seat);
      seatsToBook--;
    });
  }

  const db = { seats };
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
  return bookedSeats;
}
