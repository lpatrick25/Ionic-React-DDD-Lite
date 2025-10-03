import { Injectable } from '@angular/core';
import { MeterReadingRepository } from '../../../domain/repositories/MeterReadingRepository';
import { ApiService } from '../../services/ApiService';
import { firstValueFrom } from 'rxjs';
import { mapMeterReadingsDtoToEntity, MeterReadingsDto } from '../../../application/dto/MeterReadingDto';
import { MeterReadings } from '../../../domain/entities/MeterReading';

@Injectable({
  providedIn: 'root',
})
export class RemoteMeterReadingRepository implements MeterReadingRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<MeterReadings[]> {
    const dtos: MeterReadingsDto[] = await firstValueFrom(
      this.apiService.getMeterReadings()
    );
    return (dtos ?? []).map((dto) => mapMeterReadingsDtoToEntity(dto));
  }

  async saveAll(_readings: MeterReadings[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
