// shared/services/async-validator.service.ts
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AsyncValidatorService {
  createEmailValidator(
    validateFn: (
      email: string,
      excludeId?: number,
      entityType?: string
    ) => Observable<boolean>,
    excludeId?: number | null,
    entityType?: string
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      const adjustedExcludeId = excludeId === null ? undefined : excludeId;
      return validateFn(control.value, adjustedExcludeId, entityType).pipe(
        map((isTaken) => (isTaken ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  createPhoneValidator(
    validateFn: (
      phone: string,
      excludeId?: number,
      entityType?: string
    ) => Observable<boolean>,
    excludeId?: number | null,
    entityType?: string
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      // Convert null to undefined to match validateFn's expected type
      const adjustedExcludeId = excludeId === null ? undefined : excludeId;
      return validateFn(control.value, adjustedExcludeId, entityType).pipe(
        map((isTaken) => (isTaken ? { phoneTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  createMeterNumberValidator(
    validateFn: (
      meterNumber: string,
      excludeId?: number
    ) => Observable<boolean>,
    excludeId?: number | null
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      // Convert null to undefined to match validateFn's expected type
      const adjustedExcludeId = excludeId === null ? undefined : excludeId;
      return validateFn(control.value, adjustedExcludeId).pipe(
        map((isTaken) => (isTaken ? { meterNumberTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
}
