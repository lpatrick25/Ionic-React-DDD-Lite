import { Billing } from "../entities/billing.entity";

export interface BillingRepository {
  getAll(): Promise<Billing[]>;
  saveAll(billings: Billing[]): Promise<void>;
  clear(): Promise<void>;
}
