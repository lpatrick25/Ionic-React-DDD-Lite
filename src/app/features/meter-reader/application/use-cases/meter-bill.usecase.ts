import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MeterBill } from '../../domain/entities/meter-bill.entity';
import {
  METER_REPOSITORY,
  MeterBillRepository,
} from '../../domain/repositories/meter-bill.repository';
import { MeterBillDto } from '../dto/meter-bill.dto';

@Injectable()
export class MeterBillUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterBillRepository
  ) {}

  execute(meterDetails: MeterBillDto): Observable<MeterBill> {
    return this.meterRepository.searchMeterBill(meterDetails);
  }
}
