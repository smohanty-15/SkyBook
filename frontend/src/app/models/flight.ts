export interface Flight {
  id?: number;
  flightNumber: string;
  departureDate: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  flightStatus: 'SCHEDULED' | 'CANCELLED' | 'DELAYED';
}