import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { MeterReadingBillingRepository } from '../domain/repositories/meter-reading-billing.repository';
import { MeterReadingBillingEntity } from '../domain/entities/meter-reading-billing.entity';
import { BillingEntity } from '../domain/entities/billing.entity';
import { MeterReadingBillingDto } from '../application/dto/meter-reading-billing.dto';

/**
 * API response interface from backend
 */
export interface StoreReadingAndBillingApiResponse {
  message: string;
  reading: {
    id: number;
    meter_id: number;
    reader_id: number | null;
    reading_date: string;
    previous_reading: number;
    present_reading: number;
    consumption: number;
  };
  billing: {
    id: number;
    bill_no: string;
    consumer_id: number;
    meter_reading_id: number;
    billing_month: string;
    payment_deadline: string;
    disconnection_date: string;
    amount_due: number;
    status: 'Pending' | 'Paid' | 'Overdue';
  };
}

@Injectable({
  providedIn: 'root',
})
export class MeterReadingBillingApiRepository implements MeterReadingBillingRepository {
  private readonly endpoint = API_ENDPOINTS.STORE_METER_READING;

  constructor(private apiService: ApiService) {}

  /**
   * Store meter reading and billing to backend
   */
  storeReadingAndBilling(
    data: MeterReadingBillingDto
  ): Observable<{ reading: MeterReadingBillingEntity; billing: BillingEntity }> {
    return this.apiService
      .post<StoreReadingAndBillingApiResponse>(this.endpoint, data)
      .pipe(
        map((response: StoreReadingAndBillingApiResponse) => {
          console.log('Raw API response (storeReadingAndBilling):', response);

          const reading = new MeterReadingBillingEntity(
            response.reading.id,
            response.reading.meter_id,
            response.reading.reader_id,
            response.reading.reading_date,
            response.reading.previous_reading,
            response.reading.present_reading,
            response.reading.consumption
          );

          const billing = new BillingEntity(
            response.billing.id,
            response.billing.bill_no,
            response.billing.consumer_id,
            response.billing.meter_reading_id,
            response.billing.billing_month,
            response.billing.payment_deadline,
            response.billing.disconnection_date,
            response.billing.amount_due,
            response.billing.status
          );

          return { reading, billing };
        }),
        catchError((error) => {
          console.error('Error in storeReadingAndBilling:', error);
          return throwError(() => ({
            message:
              error.message || 'Failed to store meter reading and billing',
            errors: error.errors || {},
          }));
        })
      );
  }
}
