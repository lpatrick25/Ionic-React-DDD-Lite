import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
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

  validateEmail(email: string): Observable<boolean> {
    return this.consumerRepository.isEmailTaken(email);
  }

  validatePhone(phoneNumber: string): Observable<boolean> {
    return this.consumerRepository.isPhoneTaken(phoneNumber);
  }

  validate(formData: ConsumerFormData): Observable<void> {
    // Basic required fields
    if (!formData.firstName || !formData.lastName || !formData.address) {
      return throwError(
        () => new Error('First name, last name, and address are required')
      );
    }

    if (!formData.phoneNumber || !formData.email) {
      return throwError(() => new Error('Phone number and email are required'));
    }

    // Uniqueness checks (email and phone concurrently)
    return forkJoin({
      emailTaken: this.consumerRepository.isEmailTaken(formData.email),
      phoneTaken: this.consumerRepository.isPhoneTaken(formData.phoneNumber),
    }).pipe(
      switchMap(({ emailTaken, phoneTaken }) => {
        if (emailTaken)
          return throwError(() => new Error('Email is already taken'));
        if (phoneTaken)
          return throwError(() => new Error('Phone number is already taken'));
        return new Observable<void>((observer) => {
          observer.next();
          observer.complete();
        });
      })
    );
  }
}
