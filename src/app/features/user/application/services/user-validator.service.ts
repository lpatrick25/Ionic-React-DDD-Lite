import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
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

  validateEmail(email: string): Observable<boolean> {
    return this.userRepository.isEmailTaken(email);
  }

  validatePhone(phoneNumber: string): Observable<boolean> {
    return this.userRepository.isPhoneTaken(phoneNumber);
  }

  validate(formData: UserFormData): Observable<void> {
    // Basic required fields
    if (!formData.firstName || !formData.lastName || !formData.role) {
      return throwError(
        () => new Error('First name, last name, and role are required')
      );
    }

    if (!formData.phoneNumber || !formData.email) {
      return throwError(() => new Error('Phone number and email are required'));
    }

    // Uniqueness checks (email and phone concurrently)
    return forkJoin({
      emailTaken: this.userRepository.isEmailTaken(formData.email),
      phoneTaken: this.userRepository.isPhoneTaken(formData.phoneNumber),
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
