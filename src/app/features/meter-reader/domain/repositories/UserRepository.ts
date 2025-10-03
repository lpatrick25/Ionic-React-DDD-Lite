import { User } from '../entities/User';

export interface UserRepository {
  getAll(): Promise<User[]>;
  saveAll(users: User[]): Promise<void>;
  clear(): Promise<void>;
}
