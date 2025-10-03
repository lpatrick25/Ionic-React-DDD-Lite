import { Injectable } from '@angular/core';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { SQLiteService } from '../../services/SQLiteService';

@Injectable({
  providedIn: 'root',
})
export class LocalUserApiRepository implements UserRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<User[]> {
    const result = await this.sqliteService.executeQuery('SELECT * FROM users');
    return result.values.map((row: any) => ({
      id: row.id,
      firstName: row.first_name,
      middleName: row.middle_name,
      lastName: row.last_name,
      extensionName: row.extension_name,
      phoneNumber: row.phone_number,
      email: row.email,
      emailVerifiedAt: row.email_verified_at,
      role: row.role,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async clear(): Promise<void> {
    await this.sqliteService.executeQuery('DELETE FROM users');
  }

  async saveAll(users: User[]): Promise<void> {
    const query = `
      INSERT INTO users (
        id, first_name, middle_name, last_name, extension_name, phone_number,
        email, email_verified_at, role, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const u of users) {
      await this.sqliteService.executeQuery(query, [
        u.id,
        u.firstName,
        u.middleName ?? null,
        u.lastName,
        u.extensionName ?? null,
        u.phoneNumber,
        u.email,
        u.emailVerifiedAt ?? null,
        u.role,
        u.status,
        u.createdAt,
        u.updatedAt,
      ]);
    }
  }
}
