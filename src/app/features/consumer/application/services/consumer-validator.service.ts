import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  CONSUMER_REPOSITORY,
  ConsumerRepository,
} from '../../domain/repositories/consumer.repository';
import { ConsumerFormData } from '../dto/consumer.dto';

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
    type?: 'user' | 'concessionaire'
  ): Observable<boolean> {
    return this.consumerRepository.isEmailTaken(email, excludeId, type);
  }

  validatePhone(
    phone: string,
    excludeId?: number,
    type?: 'user' | 'concessionaire'
  ): Observable<boolean> {
    return this.consumerRepository.isPhoneTaken(phone, excludeId, type);
  }

  validate(formData: ConsumerFormData, excludeId?: number): Observable<void> {
    // Basic required fields
    if (!formData.firstName || !formData.lastName || !formData.address) {
      return throwError(
        () => new Error('First name, last name, and address are required')
      );
    }

    if (!formData.phoneNumber || !formData.email) {
      return throwError(() => new Error('Phone number and email are required'));
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
        'concessionaire'
      ),
      phoneTaken: this.consumerRepository.isPhoneTaken(
        formData.phoneNumber,
        excludeId,
        'concessionaire'
      ),
    }).pipe(
      switchMap(({ emailTaken, phoneTaken }) => {
        if (emailTaken) {
          return throwError(() => new Error('Email is already taken'));
        }
        if (phoneTaken) {
          return throwError(() => new Error('Phone number is already taken'));
        }
        return of(void 0); // cleaner success case
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
