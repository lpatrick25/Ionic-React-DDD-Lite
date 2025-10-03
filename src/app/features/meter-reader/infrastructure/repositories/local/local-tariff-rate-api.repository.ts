import { Injectable } from '@angular/core';
import { TariffRateRepository } from '../../../domain/repositories/tariff-rate.repository';
import { TariffRate } from '../../../domain/entities/tariff-rate.entity';
import { SQLiteService } from '../../services/SQLiteService';

@Injectable({
  providedIn: 'root',
})
export class LocalTariffRateApiRepository implements TariffRateRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<TariffRate[]> {
    const result = await this.sqliteService.executeQuery(
      'SELECT * FROM tariff_rates'
    );
    return result.values.map((row: any) => ({
      id: row.id,
      effectiveDate: row.effective_date,
      minConsumption: row.min_consumption,
      maxConsumption: row.max_consumption,
      flatAmount: row.flat_amount,
      ratePerCubicMeter: row.rate_per_cubic_meter,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async clear(): Promise<void> {
    await this.sqliteService.executeQuery('DELETE FROM tariff_rates');
  }

  async saveAll(tariffs: TariffRate[]): Promise<void> {
    const query = `
      INSERT INTO tariff_rates (
        id, effective_date, min_consumption, max_consumption, flat_amount,
        rate_per_cubic_meter, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const t of tariffs) {
      await this.sqliteService.executeQuery(query, [
        t.id,
        t.effectiveDate,
        t.minConsumption,
        t.maxConsumption ?? null,
        t.flatAmount,
        t.ratePerCubicMeter,
        t.createdAt,
        t.updatedAt,
      ]);
    }
  }
}
