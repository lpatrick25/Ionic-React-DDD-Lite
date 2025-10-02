import { Injectable, Inject } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import {
  METER_REPOSITORY,
  MeterRepository,
} from '../../domain/repositories/meter.repository';
import { MeterFormData } from '../dto/meter.dto';
import { MeterEntity } from '../../domain/entities/meter.entity';
import { MeterValidator } from '../services/meter-validator.service';

@Injectable({
  providedIn: 'root',
})
export class CreateMeterUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository,
    private validator: MeterValidator
  ) {}

  execute(formData: MeterFormData): Observable<MeterEntity> {
    return this.validator.validate(formData).pipe(
      switchMap(() => {
        const meter: Partial<MeterEntity> & { password?: string } = {
          concessionaireId: formData.concessionaireId,
          installationDate: formData.installationDate,
        };

        return this.meterRepository.createMeter(meter);
      })
    );
  }
}
