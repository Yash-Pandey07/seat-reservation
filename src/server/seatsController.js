import fs from 'fs';
import path from 'path';

const dbFilePath = path.join(path.resolve(), 'db.json');

export function getSeats() {
  const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
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

export function resetSeats() {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  const db = JSON.parse(data);

  db.seats.forEach(seat => (seat.booked = false));

  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
}
