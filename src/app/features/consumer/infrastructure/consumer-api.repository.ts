import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { ConsumerRepository } from '../domain/repositories/consumer.repository';
import {
  ConsumerResponse,
  ApiConsumerResponse,
  ConsumerApiResponse,
  ConsumerEntity,
} from '../domain/entities/consumer.entity';
import { CreateConsumerDto, UpdateConsumerDto } from '../application/dto/consumer.dto';

@Injectable({
  providedIn: 'root',
})
export class ConsumerApiRepository implements ConsumerRepository {
  private readonly endpoint = API_ENDPOINTS.CONSUMERS;

  constructor(private apiService: ApiService) {}

  getConsumers(page: number = 1, perPage: number = 10): Observable<ConsumerResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    // Fix: Get raw API response and transform it to domain model
    return this.apiService
      .get<ApiConsumerResponse>(this.endpoint, params)
      .pipe(
        map((apiResponse: ApiConsumerResponse) =>
          ConsumerEntity.fromApiResponseList(apiResponse)
        )
      );
  }

  getConsumerById(id: number): Observable<ConsumerEntity> {
    return this.apiService
      .get<ConsumerApiResponse>(`${this.endpoint}/${id}`)
      .pipe(
        map((apiConsumer: ConsumerApiResponse) => ConsumerEntity.fromApiResponse(apiConsumer))
      );
  }

  createConsumer(
    consumerData: Partial<ConsumerEntity> & { password?: string }
  ): Observable<ConsumerEntity> {
    const createDto: CreateConsumerDto = {
      first_name: consumerData.firstName!,
      middle_name: consumerData.middleName,
      last_name: consumerData.lastName!,
      extension_name: consumerData.extensionName,
      address: consumerData.address!,
      phone_number: consumerData.phoneNumber!,
      email: consumerData.email!,
    };

    return this.apiService
      .post<ConsumerApiResponse>(this.endpoint, createDto)
      .pipe(
        map((apiConsumer: ConsumerApiResponse) => ConsumerEntity.fromApiResponse(apiConsumer))
      );
  }

  updateConsumer(
    id: number,
    consumerData: Partial<ConsumerEntity> & { password?: string }
  ): Observable<ConsumerEntity> {
    const updateDto: UpdateConsumerDto = {
      first_name: consumerData.firstName,
      middle_name: consumerData.middleName,
      last_name: consumerData.lastName,
      extension_name: consumerData.extensionName,
      address: consumerData.address,
      phone_number: consumerData.phoneNumber,
      email: consumerData.email,
      status: consumerData.status,
    };

    // Include password only if provided
    if (consumerData.password) {
      (updateDto as any).password = consumerData.password;
    }

    return this.apiService
      .put<ConsumerApiResponse>(`${this.endpoint}/${id}`, updateDto)
      .pipe(
        map((apiConsumer: ConsumerApiResponse) => ConsumerEntity.fromApiResponse(apiConsumer))
      );
  }

  deleteConsumer(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  searchConsumers(query: string): Observable<ConsumerResponse> {
    const params = new HttpParams().set('search', query);

    // Fix: Get raw API response and transform it to domain model
    return this.apiService
      .get<ApiConsumerResponse>(this.endpoint, params)
      .pipe(
        map((apiResponse: ApiConsumerResponse) =>
          ConsumerEntity.fromApiResponseList(apiResponse)
        )
      );
  }

  // Keep the original mapping method for reference (optional)
  private mapApiToEntity(apiConsumer: ConsumerApiResponse): ConsumerEntity {
    return ConsumerEntity.fromApiResponse(apiConsumer);
  }
}
