import { Injectable } from '@angular/core';
import { MeterRepository } from '../../../domain/repositories/meter.repository';
import { Meter } from '../../../domain/entities/meter.entity';
import { ApiService } from '../../services/ApiService';
import { MeterDto, mapMeterDtoToEntity } from '../../../application/dto/meter.dto';

@Injectable({
  providedIn: 'root',
})
export class RemoteMeterRepository implements MeterRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<Meter[]> {
    const dtos = await this.apiService.getMeters().toPromise();
    return (dtos ?? []).map(mapMeterDtoToEntity);
  }

  async saveAll(_meters: Meter[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
