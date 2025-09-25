import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  METER_REPOSITORY,
  MeterRepository,
} from '../../domain/repositories/meter.repository';
import { MeterFormData } from '../dto/meter.dto';

@Injectable({
  providedIn: 'root',
})
export class MeterValidator {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository
  ) {}

  validateMeterNumber(email: string): Observable<boolean> {
    return this.meterRepository.isMeterNumberTaken(email);
  }

  validate(formData: MeterFormData): Observable<void> {
    // Basic required fields
    if (
      !formData.concessionaireId ||
      !formData.meterNumber ||
      !formData.installationDate ||
      !formData.serviceAddress
    ) {
      return throwError(
        () =>
          new Error(
            'Concessionaire ID, Meter Number, Installation Date and Service Address are required'
          )
      );
    }

    // Uniqueness checks (email and phone concurrently)
    return forkJoin({
      isMeterNumberTaken: this.meterRepository.isMeterNumberTaken(
        formData.meterNumber
      ),
    }).pipe(
      switchMap(({ isMeterNumberTaken }) => {
        if (isMeterNumberTaken)
          return throwError(() => new Error('Meter number is already taken'));
        return new Observable<void>((observer) => {
          observer.next();
          observer.complete();
        });
      })
    );
  }
}
