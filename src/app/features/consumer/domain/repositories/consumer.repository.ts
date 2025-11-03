import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Consumer, ConsumerResponse } from '../entities/consumer.entity';

export const CONSUMER_REPOSITORY = new InjectionToken<ConsumerRepository>(
  'ConsumerRepository'
);

export interface ConsumerRepository {
  getConsumers(page?: number, perPage?: number): Observable<ConsumerResponse>;
  getConsumerById(id: number): Observable<Consumer>;
  createConsumer(consumer: Partial<Consumer>): Observable<Consumer>;
  updateConsumer(id: number, consumer: Partial<Consumer>): Observable<Consumer>;
  deleteConsumer(id: number): Observable<void>;
  searchConsumers(query: string): Observable<ConsumerResponse>;
  isEmailTaken(
    email: string,
    excludeId?: number,
    type?: 'user' | 'consumer'
  ): Observable<boolean>;
  isPhoneTaken(
    phone: string,
    excludeId?: number,
    type?: 'user' | 'consumer'
  ): Observable<boolean>;
  isMeterNumberTaken(
    meterNumber: string,
    excludeId?: number
  ): Observable<boolean>;
}
