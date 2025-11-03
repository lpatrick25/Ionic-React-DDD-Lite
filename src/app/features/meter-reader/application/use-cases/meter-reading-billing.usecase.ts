import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BillingEntity } from '../../domain/entities/billing.entity';
import {
  MeterReadingBillingRepository,
  READING_BILLING_REPOSITORY,
} from '../../domain/repositories/meter-reading-billing.repository';
import { MeterReadingBillingDto } from '../dto/meter-reading-billing.dto';
import { MeterReadingBillingEntity } from '../../domain/entities/meter-reading-billing.entity';

@Injectable({ providedIn: 'root' })
export class MeterReadingBillingUseCase {
  constructor(
    @Inject(READING_BILLING_REPOSITORY)
    private readonly repository: MeterReadingBillingRepository
  ) {}

  execute(
    data: MeterReadingBillingDto
  ): Observable<{
    reading: MeterReadingBillingEntity;
    billing: BillingEntity;
  }> {
    return this.repository.storeReadingAndBilling(data);
  }
}
