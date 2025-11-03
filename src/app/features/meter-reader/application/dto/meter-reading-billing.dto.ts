export interface MeterReadingBillingDto {
  meterId: number;
  readerId?: number;
  readingDate: string;
  previousReading: number;
  presentReading: number;
}
