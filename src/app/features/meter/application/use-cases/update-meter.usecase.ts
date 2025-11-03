import { Injectable, Inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import {
  METER_REPOSITORY,
  MeterRepository,
} from '../../domain/repositories/meter.repository';
import { MeterEntity } from '../../domain/entities/meter.entity';
import { MeterFormData } from '../dto/meter.dto';
import { MeterValidator } from '../services/meter-validator.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateMeterUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository,
    private validator: MeterValidator
  ) {}

  execute(
    id: number,
    formData: MeterFormData,
    currentMeter: MeterEntity
  ): Observable<MeterEntity> {
    return this.validator.validate(formData, id).pipe(
      switchMap(() => {
        const updatedMeter: Partial<MeterEntity> & { password?: string } = {
          consumerId: formData.consumerId,
          installationDate: formData.installationDate,
        };

        return this.meterRepository.updateMeter(id, updatedMeter);
      })
    );
  }
}
