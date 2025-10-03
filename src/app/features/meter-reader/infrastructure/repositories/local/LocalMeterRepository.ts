import { Injectable } from '@angular/core';
import { MeterRepository } from '../../../domain/repositories/MeterRepository';
import { Meter } from '../../../domain/entities/Meter';
import { SQLiteService } from '../../services/SQLiteService';

@Injectable({
  providedIn: 'root',
})
export class LocalMeterRepository implements MeterRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<Meter[]> {
    const result = await this.sqliteService.executeQuery(
      'SELECT * FROM meters'
    );
    return result.values.map((row: any) => ({
      id: row.id,
      concessionaireId: row.concessionaire_id,
      installationDate: row.installation_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async clear(): Promise<void> {
    await this.sqliteService.executeQuery('DELETE FROM meters');
  }

  async saveAll(meters: Meter[]): Promise<void> {
    const query = `
      INSERT INTO meters (
        id, concessionaire_id, installation_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?)
    `;
    for (const m of meters) {
      await this.sqliteService.executeQuery(query, [
        m.id,
        m.concessionaireId,
        m.installationDate,
        m.createdAt,
        m.updatedAt,
      ]);
    }
  }
}
