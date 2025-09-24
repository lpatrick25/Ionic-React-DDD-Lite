import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_REPOSITORY, ConsumerRepository } from '../../domain/repositories/consumer.repository';

@Injectable({
  providedIn: 'root'
})
export class DeleteConsumerUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private consumerRepository: ConsumerRepository
  ) {}

  execute(consumerId: number): Observable<void> {
    return this.consumerRepository.deleteConsumer(consumerId);
  }
}
