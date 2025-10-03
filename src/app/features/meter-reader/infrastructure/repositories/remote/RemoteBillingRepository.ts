import { Injectable } from '@angular/core';
import { BillingRepository } from '../../../domain/repositories/BillingRepository';
import { Billing } from '../../../domain/entities/Billing';
import { ApiService } from '../../services/ApiService';
import {
  BillingDto,
  mapBillingDtoToEntity,
} from '../../../application/dto/BillingDto';

@Injectable({
  providedIn: 'root',
})
export class RemoteBillingRepository implements BillingRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<Billing[]> {
    const dtos = await this.apiService.getBillings().toPromise();
    return (dtos ?? []).map(mapBillingDtoToEntity);
  }

  async saveAll(_billings: Billing[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
