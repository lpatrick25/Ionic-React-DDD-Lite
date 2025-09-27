import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { MeterReadingRepository } from '../domain/repositories/meter-reading.repository';
import { MeterReadingApiResponse, MeterReadingEntity } from '../domain/entities/meter-reading.entity';
import { MeterReadingDto } from '../application/dto/meter-reading.dto';

@Injectable({
  providedIn: 'root',
})
export class MeterReadingApiRepository implements MeterReadingRepository {
  private readonly endpoint = API_ENDPOINTS.CALCULATE_BILL;

  constructor(private apiService: ApiService) {}

  calculateBill(readingDetails: MeterReadingDto): Observable<MeterReadingEntity> {
    return this.apiService
      .post<MeterReadingApiResponse>(this.endpoint, readingDetails)
      .pipe(
        map((apiResponse: MeterReadingApiResponse) => {
          console.log('Raw response:', apiResponse);
          return MeterReadingEntity.fromApiResponse(apiResponse);
        }),
        catchError((error) => {
          return throwError(() => ({
            message: error.message || 'MeterReading not found',
            errors: error.errors || {},
          }));
        })
      );
  }
}
