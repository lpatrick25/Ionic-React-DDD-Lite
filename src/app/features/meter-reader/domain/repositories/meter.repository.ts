import { Meter } from "../entities/meter.entity";

export interface MeterRepository {
  getAll(): Promise<Meter[]>;
  saveAll(meters: Meter[]): Promise<void>;
  clear(): Promise<void>;
}
