import { Meter } from "../entities/Meter";

export interface MeterRepository {
  getAll(): Promise<Meter[]>;
  saveAll(meters: Meter[]): Promise<void>;
  clear(): Promise<void>;
}
