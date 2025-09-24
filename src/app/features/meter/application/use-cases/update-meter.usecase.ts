import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { METER_REPOSITORY, MeterRepository } from '../../domain/repositories/meter.repository';
import { MeterEntity } from '../../domain/entities/meter.entity';
import { MeterFormData } from '../dto/meter.dto';
import { ROLES, STATUS } from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateMeterUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository
  ) {}

  execute(id: number, formData: MeterFormData, currentMeter: MeterEntity): Observable<MeterEntity> {
    // Transform form data to partial meter
    const updatedMeter: Partial<MeterEntity> & { password?: string } = {
      concessionaireId: formData.concessionaireId,
      meterNumber: formData.meterNumber,
      installationDate: formData.installationDate,
      serviceAddress: formData.serviceAddress,
      status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE
    };

    return this.meterRepository.updateMeter(id, updatedMeter);
  }
}
