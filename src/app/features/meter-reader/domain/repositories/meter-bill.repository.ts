import { Observable } from 'rxjs';
import { MeterBillEntity } from '../entities/meter-bill.entity';
import { InjectionToken } from '@angular/core';

export const METER_REPOSITORY = new InjectionToken<MeterBillRepository>('MeterBillRepository');

export interface MeterBillRepository {
  searchMeterBill(meterDetails: { meterNumber: string }): Observable<MeterBillEntity>;
}
