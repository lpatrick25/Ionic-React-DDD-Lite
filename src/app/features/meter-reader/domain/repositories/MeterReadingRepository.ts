import { MeterReadings } from "../entities/MeterReading";

export interface MeterReadingRepository {
  getAll(): Promise<MeterReadings[]>;
  saveAll(readings: MeterReadings[]): Promise<void>;
  clear(): Promise<void>;
}
