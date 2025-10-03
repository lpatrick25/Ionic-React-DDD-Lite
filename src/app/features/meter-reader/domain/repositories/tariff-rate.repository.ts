import { TariffRate } from "../entities/tariff-rate.entity";

export interface TariffRateRepository {
  getAll(): Promise<TariffRate[]>;
  saveAll(tariffs: TariffRate[]): Promise<void>;
  clear(): Promise<void>;
}
