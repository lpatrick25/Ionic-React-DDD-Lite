import { Consumer } from "../entities/consumer.entity";

export interface ConsumerRepository {
  getAll(): Promise<Consumer[]>;
  saveAll(consumers: Consumer[]): Promise<void>;
  clear(): Promise<void>;
}
