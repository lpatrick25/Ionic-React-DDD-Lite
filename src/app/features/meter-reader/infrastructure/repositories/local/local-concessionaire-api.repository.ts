import { Injectable } from '@angular/core';
import { ConcessionaireRepository } from '../../../domain/repositories/concessionaire.repository';
import { Concessionaire } from '../../../domain/entities/concessionaire.entity';
import { SQLiteService } from '../../services/SQLiteService';

@Injectable({
  providedIn: 'root',
})
export class LocalConcessionaireApiRepository implements ConcessionaireRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<Concessionaire[]> {
    const result = await this.sqliteService.executeQuery(
      'SELECT * FROM concessionaires'
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
    await this.sqliteService.executeQuery('DELETE FROM concessionaires');
  }

  async saveAll(concessionaires: Concessionaire[]): Promise<void> {
    const query = `
      INSERT INTO concessionaires (
        id, account_number, meter_number, first_name, middle_name, last_name,
        extension_name, address, street_address, email, phone_number, meter_type,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const c of concessionaires) {
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
