import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { METER_REPOSITORY, MeterRepository } from '../../domain/repositories/meter.repository';

@Injectable({
  providedIn: 'root'
})
export class DeleteMeterUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository
  ) {}

  execute(meterId: number): Observable<void> {
    return this.meterRepository.deleteMeter(meterId);
  }
}
