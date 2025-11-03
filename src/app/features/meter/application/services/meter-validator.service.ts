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

  validate(formData: MeterFormData, excludeId?: number): Observable<void> {
    // Basic required fields
    if (!formData.consumerId || !formData.installationDate) {
      return throwError(
        () =>
          new Error(
            'Consumer ID, Meter Number, Installation Date and Service Address are required'
          )
      );
    }

    return of(void 0);
  }
}
