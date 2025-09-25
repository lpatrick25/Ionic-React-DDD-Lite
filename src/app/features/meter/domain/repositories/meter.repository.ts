import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Meter, MeterResponse } from '../entities/meter.entity';

// Create injection token for the repository interface
export const METER_REPOSITORY = new InjectionToken<MeterRepository>('MeterRepository');

export interface MeterRepository {
  getMeters(page?: number, perPage?: number): Observable<MeterResponse>;
  getMeterById(id: number): Observable<Meter>;
  createMeter(meter: Partial<Meter>): Observable<Meter>;
  updateMeter(id: number, meter: Partial<Meter>): Observable<Meter>;
  deleteMeter(id: number): Observable<void>;
  searchMeters(query: string): Observable<MeterResponse>;
  isMeterNumberTaken(meterNumber: string): Observable<boolean>;
}
