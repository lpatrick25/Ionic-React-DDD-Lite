import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  METER_REPOSITORY,
  MeterRepository,
} from '../../domain/repositories/meter.repository';
import { MeterFormData, CreateMeterDto } from '../dto/meter.dto';
import { MeterEntity } from '../../domain/entities/meter.entity';
import { STATUS, type Status } from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CreateMeterUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository
  ) {}

  execute(formData: MeterFormData): Observable<MeterEntity> {
    // Validate required fields
    if (!formData.concessionaireId || !formData.meterNumber || !formData.installationDate || !formData.serviceAddress) {
      return throwError(
        () => new Error('Concessionaire ID, Meter Number, Installation Date and Service Address are required')
      );
    }

    // Transform form data to DTO
    const createDto: CreateMeterDto = {
      concessionaire_id: formData.concessionaireId,
      meter_number: formData.meterNumber,
      installation_date: formData.installationDate,
      service_address: formData.serviceAddress,
      status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
    };

    const meter: Partial<MeterEntity> & { password?: string } = {
      concessionaireId: createDto.concessionaire_id,
      meterNumber: createDto.meter_number,
      installationDate: createDto.installation_date,
      serviceAddress: createDto.service_address,
      status: createDto.status,
    };

    return this.meterRepository.createMeter(meter);
  }
}
