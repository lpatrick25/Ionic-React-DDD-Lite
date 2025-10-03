import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConcessionaireDto } from '../../application/dto/concessionaire.dto';
import { MeterDto } from '../../application/dto/meter.dto';
import { BillingDto } from '../../application/dto/billing.dto';
import { TariffRateDto } from '../../application/dto/tariff-rate.dto';
import { UserDto } from '../../application/dto/user.dto';
import { MeterReadingsDto } from '../../application/dto/meter-reading.dto';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://192.168.100.8:8000/api';

  constructor(private http: HttpClient) {}

  getConcessionaires(): Observable<ConcessionaireDto[]> {
    return this.http
      .get<{ code: number; message: string; content: ConcessionaireDto[] }>(
        `${this.baseUrl}/offlineConcessionaire`
      )
      .pipe(map((response) => response.content));
  }

  getMeters(): Observable<MeterDto[]> {
    return this.http
      .get<{ code: number; message: string; content: MeterDto[] }>(
        `${this.baseUrl}/offlineMeter`
      )
      .pipe(map((response) => response.content));
  }

  getMeterReadings(): Observable<MeterReadingsDto[]> {
    return this.http
      .get<{ code: number; message: string; content: MeterReadingsDto[] }>(
        `${this.baseUrl}/offlineMeterReading`
      )
      .pipe(map((response) => response.content));
  }

  getBillings(): Observable<BillingDto[]> {
    return this.http
      .get<{ code: number; message: string; content: BillingDto[] }>(
        `${this.baseUrl}/offlineBilling`
      )
      .pipe(map((response) => response.content));
  }

  getTariffRates(): Observable<TariffRateDto[]> {
    return this.http
      .get<{ code: number; message: string; content: TariffRateDto[] }>(
        `${this.baseUrl}/offlineTariff`
      )
      .pipe(map((response) => response.content));
  }

  getUsers(): Observable<UserDto[]> {
    return this.http
      .get<{ code: number; message: string; content: UserDto[] }>(
        `${this.baseUrl}/offlineUser`
      )
      .pipe(map((response) => response.content));
  }
}
