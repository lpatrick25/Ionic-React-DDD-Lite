import { TariffRate } from "../entities/TariffRate";

export interface TariffRateRepository {
  getAll(): Promise<TariffRate[]>;
  saveAll(tariffs: TariffRate[]): Promise<void>;
  clear(): Promise<void>;
}
