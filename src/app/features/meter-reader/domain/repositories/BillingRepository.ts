import { Billing } from "../entities/Billing";

export interface BillingRepository {
  getAll(): Promise<Billing[]>;
  saveAll(billings: Billing[]): Promise<void>;
  clear(): Promise<void>;
}
