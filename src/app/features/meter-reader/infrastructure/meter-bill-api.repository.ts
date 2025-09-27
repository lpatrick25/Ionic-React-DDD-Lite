import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { MeterBillDto } from '../application/dto/meter-bill.dto';
import { MeterBillApiResponse, MeterBillEntity } from '../domain/entities/meter-bill.entity';
import { MeterBillRepository } from '../domain/repositories/meter-bill.repository';

@Injectable({
  providedIn: 'root',
})
export class MeterBillApiRepository implements MeterBillRepository {
  private readonly endpoint = API_ENDPOINTS.SEARCH_METER;

  constructor(private apiService: ApiService) {}

  searchMeterBill(meterDetails: MeterBillDto): Observable<MeterBillEntity> {
    return this.apiService
      .post<MeterBillApiResponse>(this.endpoint, meterDetails)
      .pipe(
        map((apiResponse: MeterBillApiResponse) => {
          console.log('Raw response:', apiResponse);
          return MeterBillEntity.fromApiResponse(apiResponse);
        }),
        catchError((error) => {
          return throwError(() => ({
            message: error.message || 'MeterBill not found',
            errors: error.errors || {},
          }));
        })
      );
  }
}
