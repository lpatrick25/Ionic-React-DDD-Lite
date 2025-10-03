import { Injectable } from '@angular/core';
import { MeterReadingRepository } from '../../../domain/repositories/meter-readings.repository';
import { ApiService } from '../../services/ApiService';
import { firstValueFrom } from 'rxjs';
import { mapMeterReadingsDtoToEntity, MeterReadingsDto } from '../../../application/dto/meter-reading.dto';
import { MeterReadings } from '../../../domain/entities/meter-reading.entity';

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
