import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CONSUMER_REPOSITORY,
  ConsumerRepository,
} from '../../domain/repositories/consumer.repository';
import { ConsumerFormData } from '../dto/consumer.dto';
import { MeterType } from 'src/app/core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ConsumerValidator {
  constructor(
    @Inject(CONSUMER_REPOSITORY) private consumerRepository: ConsumerRepository
  ) {}

  validateEmail(
    email: string,
    excludeId?: number,
    type?: 'user' | 'consumer'
  ): Observable<boolean> {
    return this.consumerRepository.isEmailTaken(email, excludeId, type);
  }

  validatePhone(
    phone: string,
    excludeId?: number,
    type?: 'user' | 'consumer'
  ): Observable<boolean> {
    return this.consumerRepository.isPhoneTaken(phone, excludeId, type);
  }

  validateMeterNumber(
    meterNumber: string,
    excludeId?: number
  ): Observable<boolean> {
    return this.consumerRepository.isMeterNumberTaken(meterNumber, excludeId);
  }

  validate(formData: ConsumerFormData, excludeId?: number): Observable<void> {
    // Basic required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.address ||
      !formData.meterNumber
    ) {
      return throwError(
        () =>
          new Error(
            'First name, last name, address, and meter number are required'
          )
      );
    }

    if (!formData.phoneNumber || !formData.email) {
      return throwError(() => new Error('Phone number and email are required'));
    }

    // Validate meter type
    if (!Object.values(MeterType).includes(formData.meterType as MeterType)) {
      return throwError(() => new Error('Invalid meter type'));
    }

    // Format validations
    if (!this.isValidEmail(formData.email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    if (!this.isValidPhoneNumber(formData.phoneNumber)) {
      return throwError(() => new Error('Invalid phone number format'));
    }

    // Uniqueness checks (run concurrently)
    return forkJoin({
      emailTaken: this.consumerRepository.isEmailTaken(
        formData.email,
        excludeId,
        'consumer'
      ),
      phoneTaken: this.consumerRepository.isPhoneTaken(
        formData.phoneNumber,
        excludeId,
        'consumer'
      ),
      meterNumberTaken: this.consumerRepository.isMeterNumberTaken(
        formData.meterNumber,
        excludeId
      ),
    }).pipe(
      switchMap(({ emailTaken, phoneTaken, meterNumberTaken }) => {
        if (emailTaken) {
          return throwError(() => new Error('Email is already taken'));
        }
        if (phoneTaken) {
          return throwError(() => new Error('Phone number is already taken'));
        }
        if (meterNumberTaken) {
          return throwError(() => new Error('Meter number is already taken')); // Fixed typo
        }
        return of(void 0); // Success case
      })
    );
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
