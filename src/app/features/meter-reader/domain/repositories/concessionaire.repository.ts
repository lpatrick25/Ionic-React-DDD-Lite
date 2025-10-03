import { Concessionaire } from "../entities/concessionaire.entity";

export interface ConcessionaireRepository {
  getAll(): Promise<Concessionaire[]>;
  saveAll(concessionaires: Concessionaire[]): Promise<void>;
  clear(): Promise<void>;
}
