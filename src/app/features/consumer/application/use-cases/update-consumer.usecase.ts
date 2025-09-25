import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CONSUMER_REPOSITORY,
  ConsumerRepository,
} from '../../domain/repositories/consumer.repository';
import { ConsumerEntity } from '../../domain/entities/consumer.entity';
import { ConsumerFormData } from '../dto/consumer.dto';
import { STATUS } from '../../../../core/constants/api.constants';
import { ConsumerValidator } from '../services/consumer-validator.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateConsumerUseCase {
  constructor(
    @Inject(CONSUMER_REPOSITORY) private consumerRepository: ConsumerRepository,
    private validator: ConsumerValidator
  ) {}

  execute(
    id: number,
    formData: ConsumerFormData,
    currentConsumer: ConsumerEntity
  ): Observable<ConsumerEntity> {
    return this.validator.validate(formData, id).pipe(
      switchMap(() => {
        const updatedConsumer: Partial<ConsumerEntity> = {
          firstName: formData.firstName,
          middleName: formData.middleName || null,
          lastName: formData.lastName,
          extensionName: formData.extensionName || null,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
        };

        return this.consumerRepository.updateConsumer(id, updatedConsumer);
      })
    );
  }
}
