import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  CONSUMER_REPOSITORY,
  ConsumerRepository,
} from '../../domain/repositories/consumer.repository';
import { ConsumerFormData, CreateConsumerDto } from '../dto/consumer.dto';
import { ConsumerEntity } from '../../domain/entities/consumer.entity';
import { STATUS, type Status } from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CreateConsumerUseCase {
  constructor(
    @Inject(CONSUMER_REPOSITORY) private consumerRepository: ConsumerRepository
  ) {}

  execute(formData: ConsumerFormData): Observable<ConsumerEntity> {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.address) {
      return throwError(
        () => new Error('First name, last name, and address are required')
      );
    }

    if (!formData.phoneNumber || !formData.email) {
      return throwError(() => new Error('Phone number and email are required'));
    }

    // Transform form data to DTO
    const createDto: CreateConsumerDto = {
      first_name: formData.firstName,
      middle_name: formData.middleName || null,
      last_name: formData.lastName,
      extension_name: formData.extensionName || null,
      phone_number: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
      status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
    };

    // Business logic validation
    if (!this.isValidEmail(createDto.email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    if (!this.isValidPhoneNumber(createDto.phone_number)) {
      return throwError(() => new Error('Invalid phone number format'));
    }

    const consumer: Partial<ConsumerEntity> & { password?: string } = {
      firstName: createDto.first_name,
      middleName: createDto.middle_name,
      lastName: createDto.last_name,
      extensionName: createDto.extension_name,
      phoneNumber: createDto.phone_number,
      email: createDto.email,
      address: createDto.address,
      status: createDto.status,
    };

    return this.consumerRepository.createConsumer(consumer);
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
