import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CONSUMER_REPOSITORY,
  ConsumerRepository,
} from '../../domain/repositories/consumer.repository';
import { ConsumerFormData } from '../dto/consumer.dto';
import { ConsumerEntity } from '../../domain/entities/consumer.entity';
import { STATUS } from '../../../../core/constants/api.constants';
import { ConsumerValidator } from '../services/consumer-validator.service';

@Injectable({
  providedIn: 'root',
})
export class CreateConsumerUseCase {
  constructor(
    @Inject(CONSUMER_REPOSITORY) private consumerRepository: ConsumerRepository,
    private validator: ConsumerValidator
  ) {}

  execute(formData: ConsumerFormData): Observable<ConsumerEntity> {
    return this.validator.validate(formData).pipe(
      switchMap(() => {
        const consumer: Partial<ConsumerEntity> = {
          firstName: formData.firstName,
          middleName: formData.middleName || null,
          lastName: formData.lastName,
          extensionName: formData.extensionName || null,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          address: formData.address,
          status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
        };

        return this.consumerRepository.createConsumer(consumer);
      })
    );
  }
}
