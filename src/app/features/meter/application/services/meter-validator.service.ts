import { Inject, Injectable } from '@angular/core';
import { Observable, throwError, forkJoin, of } from 'rxjs';
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

  validateMeterNumber(
    meterNumber: string,
    excludeId?: number
  ): Observable<boolean> {
    return this.meterRepository.isMeterNumberTaken(meterNumber, excludeId);
  }

  validate(formData: MeterFormData, excludeId?: number): Observable<void> {
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
        formData.meterNumber,
        excludeId
      ),
    }).pipe(
      switchMap(({ isMeterNumberTaken }) => {
        if (isMeterNumberTaken)
          return throwError(() => new Error('Meter number is already taken'));
        return of(void 0);
      })
    );
  }
}
