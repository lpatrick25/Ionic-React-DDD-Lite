import { Injectable, Inject } from '@angular/core';
import { Observable, switchMap, throwError } from 'rxjs';
import {
  METER_REPOSITORY,
  MeterRepository,
} from '../../domain/repositories/meter.repository';
import { MeterEntity } from '../../domain/entities/meter.entity';
import { MeterFormData } from '../dto/meter.dto';
import { ROLES, STATUS } from '../../../../core/constants/api.constants';
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
          concessionaireId: formData.concessionaireId,
          meterNumber: formData.meterNumber,
          installationDate: formData.installationDate,
          serviceAddress: formData.serviceAddress,
          status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
        };

        return this.meterRepository.updateMeter(id, updatedMeter);
      })
    );
  }
}
