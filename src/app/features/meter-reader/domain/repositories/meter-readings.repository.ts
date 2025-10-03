import { MeterReadings } from "../entities/meter-reading.entity";

export interface MeterReadingRepository {
  getAll(): Promise<MeterReadings[]>;
  saveAll(readings: MeterReadings[]): Promise<void>;
  clear(): Promise<void>;
}
