import { User } from '../entities/user.entity';

export interface UserRepository {
  getAll(): Promise<User[]>;
  saveAll(users: User[]): Promise<void>;
  clear(): Promise<void>;
}
