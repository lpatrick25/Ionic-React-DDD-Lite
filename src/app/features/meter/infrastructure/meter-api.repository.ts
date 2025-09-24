import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { MeterRepository } from '../domain/repositories/meter.repository';
import {
  MeterResponse,
  ApiMeterResponse,
  MeterApiResponse,
  MeterEntity,
} from '../domain/entities/meter.entity';
import { CreateMeterDto, UpdateMeterDto } from '../application/dto/meter.dto';

@Injectable({
  providedIn: 'root',
})
export class MeterApiRepository implements MeterRepository {
  private readonly endpoint = API_ENDPOINTS.METERS;

  constructor(private apiService: ApiService) {}

  getMeters(page: number = 1, perPage: number = 10): Observable<MeterResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    // Fix: Get raw API response and transform it to domain model
    return this.apiService
      .get<ApiMeterResponse>(this.endpoint, params)
      .pipe(
        map((apiResponse: ApiMeterResponse) =>
          MeterEntity.fromApiResponseList(apiResponse)
        )
      );
  }

  getMeterById(id: number): Observable<MeterEntity> {
    return this.apiService
      .get<MeterApiResponse>(`${this.endpoint}/${id}`)
      .pipe(
        map((apiMeter: MeterApiResponse) => MeterEntity.fromApiResponse(apiMeter))
      );
  }

  createMeter(
    meterData: Partial<MeterEntity> & { password?: string }
  ): Observable<MeterEntity> {
    const createDto: CreateMeterDto = {
      concessionaire_id: meterData.concessionaireId!,
      meter_number: meterData.meterNumber!,
      installation_date: meterData.installationDate!,
      service_address: meterData.serviceAddress!,
      status: meterData.status!,
    };

    return this.apiService
      .post<MeterApiResponse>(this.endpoint, createDto)
      .pipe(
        map((apiMeter: MeterApiResponse) => MeterEntity.fromApiResponse(apiMeter))
      );
  }

  updateMeter(
    id: number,
    meterData: Partial<MeterEntity> & { password?: string }
  ): Observable<MeterEntity> {
    const updateDto: UpdateMeterDto = {
      concessionaire_id: meterData.concessionaireId,
      meter_number: meterData.meterNumber,
      installation_date: meterData.installationDate,
      service_address: meterData.serviceAddress,
      status: meterData.status,
    };

    // Include password only if provided
    if (meterData.password) {
      (updateDto as any).password = meterData.password;
    }

    return this.apiService
      .put<MeterApiResponse>(`${this.endpoint}/${id}`, updateDto)
      .pipe(
        map((apiMeter: MeterApiResponse) => MeterEntity.fromApiResponse(apiMeter))
      );
  }

  deleteMeter(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  searchMeters(query: string): Observable<MeterResponse> {
    const params = new HttpParams().set('search', query);

    // Fix: Get raw API response and transform it to domain model
    return this.apiService
      .get<ApiMeterResponse>(this.endpoint, params)
      .pipe(
        map((apiResponse: ApiMeterResponse) =>
          MeterEntity.fromApiResponseList(apiResponse)
        )
      );
  }

  // Keep the original mapping method for reference (optional)
  private mapApiToEntity(apiMeter: MeterApiResponse): MeterEntity {
    return MeterEntity.fromApiResponse(apiMeter);
  }
}
