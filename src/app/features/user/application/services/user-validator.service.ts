import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { UserFormData } from '../dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserValidator {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  validateEmail(
    email: string,
    excludeId?: number,
    type: 'user' | 'concessionaire' = 'user'
  ): Observable<boolean> {
    return this.userRepository.isEmailTaken(email, excludeId, type);
  }

  validatePhone(
    phoneNumber: string,
    excludeId?: number,
    type: 'user' | 'concessionaire' = 'user'
  ): Observable<boolean> {
    return this.userRepository.isPhoneTaken(phoneNumber, excludeId, type);
  }

  validate(formData: UserFormData, excludeId?: number): Observable<void> {
    // Basic required fields
    if (!formData.firstName || !formData.lastName || !formData.role) {
      return throwError(
        () => new Error('First name, last name, and role are required')
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

    // Uniqueness checks (run in parallel)
    return forkJoin({
      emailTaken: this.userRepository.isEmailTaken(
        formData.email,
        excludeId,
        'user'
      ),
      phoneTaken: this.userRepository.isPhoneTaken(
        formData.phoneNumber,
        excludeId,
        'user'
      ),
    }).pipe(
      switchMap(({ emailTaken, phoneTaken }) => {
        if (emailTaken) {
          return throwError(() => new Error('Email is already taken'));
        }
        if (phoneTaken) {
          return throwError(() => new Error('Phone number is already taken'));
        }
        return of(void 0);
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
