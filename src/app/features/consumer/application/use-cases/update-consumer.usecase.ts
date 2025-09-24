import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { CONSUMER_REPOSITORY, ConsumerRepository } from '../../domain/repositories/consumer.repository';
import { ConsumerEntity } from '../../domain/entities/consumer.entity';
import { ConsumerFormData } from '../dto/consumer.dto';
import { ROLES, STATUS } from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateConsumerUseCase {
  constructor(
    @Inject(CONSUMER_REPOSITORY) private consumerRepository: ConsumerRepository
  ) {}

  execute(id: number, formData: ConsumerFormData, currentConsumer: ConsumerEntity): Observable<ConsumerEntity> {
    // Transform form data to partial consumer
    const updatedConsumer: Partial<ConsumerEntity> & { password?: string } = {
      firstName: formData.firstName,
      middleName: formData.middleName || null,
      lastName: formData.lastName,
      extensionName: formData.extensionName || null,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE // Fix: Use STATUS.ACTIVE
    };

    // Business logic validation
    if (updatedConsumer.email && !this.isValidEmail(updatedConsumer.email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    if (updatedConsumer.phoneNumber && !this.isValidPhoneNumber(updatedConsumer.phoneNumber)) {
      return throwError(() => new Error('Invalid phone number format'));
    }

    return this.consumerRepository.updateConsumer(id, updatedConsumer);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
}
