import { Injectable } from '@angular/core';
import { MeterReadingRepository } from '../../../domain/repositories/meter-readings.repository';
import { SQLiteService } from '../../services/SQLiteService';
import { MeterReadings } from '../../../domain/entities/meter-reading.entity';

@Injectable({
  providedIn: 'root',
})
export class LocalMeterReadingApiRepository implements MeterReadingRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<MeterReadings[]> {
    const result = await this.sqliteService.executeQuery(
      'SELECT * FROM meter_readings'
    );
    return result.values.map((row: any) => ({
      id: row.id,
      meterId: row.meter_id,
      readerId: row.reader_id,
      readingDate: row.reading_date,
      previousReading: row.previous_reading,
      presentReading: row.present_reading,
      consumption: row.consumption,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async clear(): Promise<void> {
    await this.sqliteService.executeQuery('DELETE FROM meter_readings');
  }

  async saveAll(readings: MeterReadings[]): Promise<void> {
    const query = `
      INSERT INTO meter_readings (
        id, meter_id, reader_id, reading_date, previous_reading, present_reading,
        consumption, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const r of readings) {
      await this.sqliteService.executeQuery(query, [
        r.id,
        r.meterId,
        r.readerId ?? null,
        r.readingDate,
        r.previousReading,
        r.presentReading,
        r.consumption,
        r.createdAt,
        r.updatedAt,
      ]);
    }
  }
}
