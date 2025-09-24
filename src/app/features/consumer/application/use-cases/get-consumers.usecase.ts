import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CONSUMER_REPOSITORY, ConsumerRepository } from '../../domain/repositories/consumer.repository';
import { ConsumerResponse } from '../../domain/entities/consumer.entity';

@Injectable({
  providedIn: 'root'
})
export class GetConsumersUseCase {
  constructor(
    @Inject(CONSUMER_REPOSITORY) private consumerRepository: ConsumerRepository
  ) {}

  execute(page: number = 1, perPage: number = 10): Observable<ConsumerResponse> {
    // Business logic can be added here (e.g., role-based filtering)
    // For example, filter consumers based on current consumer's role
    return this.consumerRepository.getConsumers(page, perPage);
  }

  // Additional method for admin-only operations
  getAllConsumersAdminOnly(): Observable<ConsumerResponse> {
    return this.consumerRepository.getConsumers(1, 1000); // Get all consumers for admin
  }
}
