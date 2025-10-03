import { Concessionaire } from "../entities/Concessionaire";

export interface ConcessionaireRepository {
  getAll(): Promise<Concessionaire[]>;
  saveAll(concessionaires: Concessionaire[]): Promise<void>;
  clear(): Promise<void>;
}
