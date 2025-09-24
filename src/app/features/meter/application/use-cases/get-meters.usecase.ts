import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { METER_REPOSITORY, MeterRepository } from '../../domain/repositories/meter.repository';
import { MeterResponse } from '../../domain/entities/meter.entity';

@Injectable({
  providedIn: 'root'
})
export class GetMetersUseCase {
  constructor(
    @Inject(METER_REPOSITORY) private meterRepository: MeterRepository
  ) {}

  execute(page: number = 1, perPage: number = 10): Observable<MeterResponse> {
    // Business logic can be added here (e.g., role-based filtering)
    // For example, filter meters based on current meter's role
    return this.meterRepository.getMeters(page, perPage);
  }

  // Additional method for admin-only operations
  getAllMetersAdminOnly(): Observable<MeterResponse> {
    return this.meterRepository.getMeters(1, 1000); // Get all meters for admin
  }
}
