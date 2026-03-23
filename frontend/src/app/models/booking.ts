export interface Booking {
  bookingId?: number;
  user?: any;
  flight?: any;
  fromSeatNo?: number;
  toSeatNo?: number;
  noOfSeat: number;
  passenger2?: string;
  passenger3?: string;
  passenger4?: string;
  pnr?: string;
  bookingStatus?: 'CONFIRMED' | 'CANCELLED' | 'FLIGHTCANCELLED';
}