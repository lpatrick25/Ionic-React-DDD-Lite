export interface MeterReadings {
  id: number;
  meterId: number;
  readerId: number | null;
  readingDate: string;
  previousReading: number;
  presentReading: number;
  consumption: number;
  createdAt: string;
  updatedAt: string;
}
