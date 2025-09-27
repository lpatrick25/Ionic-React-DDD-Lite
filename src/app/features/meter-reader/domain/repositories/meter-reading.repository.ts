import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { MeterReadingEntity } from '../entities/meter-reading.entity';

export const READING_REPOSITORY = new InjectionToken<MeterReadingRepository>('MeterReadingRepository');

export interface MeterReadingRepository {
  calculateBill(meterDetails: { previousReading: number; currentReading: number; readingDate: string }): Observable<MeterReadingEntity>;
}
