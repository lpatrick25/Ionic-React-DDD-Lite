import { Observable } from 'rxjs';
import { InjectionToken } from '@angular/core';
import { BillingEntity } from '../entities/billing.entity';
import { MeterReadingBillingDto } from '../../application/dto/meter-reading-billing.dto';
import { MeterReadingBillingEntity } from '../entities/meter-reading-billing.entity';

export const READING_BILLING_REPOSITORY =
  new InjectionToken<MeterReadingBillingRepository>(
    'MeterReadingBillingRepository'
  );

export interface MeterReadingBillingRepository {
  storeReadingAndBilling(
    data: MeterReadingBillingDto
  ): Observable<{ reading: MeterReadingBillingEntity; billing: BillingEntity }>;
}
