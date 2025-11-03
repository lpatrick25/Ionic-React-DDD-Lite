import { Injectable } from '@angular/core';
import { ConsumerRepository } from '../../../domain/repositories/consumer.repository';
import { Consumer } from '../../../domain/entities/consumer.entity';
import { SQLiteService } from '../../services/SQLiteService';

@Injectable({
  providedIn: 'root',
})
export class LocalConsumerApiRepository implements ConsumerRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<Consumer[]> {
    const result = await this.sqliteService.executeQuery(
      'SELECT * FROM consumers'
    );
    return result.values.map((row: any) => ({
      id: row.id,
      accountNumber: row.account_number,
      meterNumber: row.meter_number,
      firstName: row.first_name,
      middleName: row.middle_name,
      lastName: row.last_name,
      extensionName: row.extension_name,
      address: row.address,
      streetAddress: row.street_address,
      email: row.email,
      phoneNumber: row.phone_number,
      meterType: row.meter_type,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async clear(): Promise<void> {
    await this.sqliteService.executeQuery('DELETE FROM consumers');
  }

  async saveAll(consumers: Consumer[]): Promise<void> {
    const query = `
      INSERT INTO consumers (
        id, account_number, meter_number, first_name, middle_name, last_name,
        extension_name, address, street_address, email, phone_number, meter_type,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const c of consumers) {
      await this.sqliteService.executeQuery(query, [
        c.id,
        c.accountNumber,
        c.meterNumber,
        c.firstName,
        c.middleName ?? null,
        c.lastName,
        c.extensionName ?? null,
        c.address,
        c.streetAddress ?? null,
        c.email,
        c.phoneNumber,
        c.meterType,
        c.status,
        c.createdAt,
        c.updatedAt,
      ]);
    }
  }
}
