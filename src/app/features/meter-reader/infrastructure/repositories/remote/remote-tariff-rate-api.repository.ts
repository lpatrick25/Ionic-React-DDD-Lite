import { Injectable } from '@angular/core';
import { TariffRateRepository } from '../../../domain/repositories/tariff-rate.repository';
import { TariffRate } from '../../../domain/entities/tariff-rate.entity';
import { ApiService } from '../../services/ApiService';
import { TariffRateDto, mapTariffRateDtoToEntity } from '../../../application/dto/tariff-rate.dto';

@Injectable({
  providedIn: 'root',
})
export class RemoteTariffRateRepository implements TariffRateRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<TariffRate[]> {
    const dtos = await this.apiService.getTariffRates().toPromise();
    return (dtos ?? []).map(mapTariffRateDtoToEntity);
  }

  async saveAll(_tariffs: TariffRate[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
