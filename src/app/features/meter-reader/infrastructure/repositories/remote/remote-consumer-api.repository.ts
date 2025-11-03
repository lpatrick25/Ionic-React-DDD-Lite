import { Injectable } from '@angular/core';
import { ConsumerRepository } from '../../../domain/repositories/consumer.repository';
import { Consumer } from '../../../domain/entities/consumer.entity';
import { ApiService } from '../../services/ApiService';
import { ConsumerDto, mapConsumerDtoToEntity } from '../../../application/dto/consumer.dto';

@Injectable({
  providedIn: 'root',
})
export class RemoteConsumerRepository implements ConsumerRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<Consumer[]> {
    const dtos = await this.apiService.getConsumers().toPromise();
    return (dtos ?? []).map(mapConsumerDtoToEntity);
  }

  async saveAll(_consumers: Consumer[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
