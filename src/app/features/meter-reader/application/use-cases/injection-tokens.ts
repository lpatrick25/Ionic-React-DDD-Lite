import { InjectionToken } from '@angular/core';
import { ConsumerRepository } from '../../domain/repositories/consumer.repository';
import { MeterRepository } from '../../domain/repositories/meter.repository';
import { BillingRepository } from '../../domain/repositories/billing.repository';
import { TariffRateRepository } from '../../domain/repositories/tariff-rate.repository';
import { MeterReadingRepository } from '../../domain/repositories/meter-readings.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

export const CONCESSIONAIRE_REPO_REMOTE =
  new InjectionToken<ConsumerRepository>(
    'ConsumerRepositoryRemote'
  );
export const CONCESSIONAIRE_REPO_LOCAL =
  new InjectionToken<ConsumerRepository>('ConsumerRepositoryLocal');

export const METER_REPO_REMOTE = new InjectionToken<MeterRepository>(
  'MeterRepositoryRemote'
);
export const METER_REPO_LOCAL = new InjectionToken<MeterRepository>(
  'MeterRepositoryLocal'
);

export const BILLING_REPO_REMOTE = new InjectionToken<BillingRepository>(
  'BillingRepositoryRemote'
);
export const BILLING_REPO_LOCAL = new InjectionToken<BillingRepository>(
  'BillingRepositoryLocal'
);

export const TARIFF_REPO_REMOTE = new InjectionToken<TariffRateRepository>(
  'TariffRateRepositoryRemote'
);
export const TARIFF_REPO_LOCAL = new InjectionToken<TariffRateRepository>(
  'TariffRateRepositoryLocal'
);

export const METER_READING_REPO_REMOTE =
  new InjectionToken<MeterReadingRepository>('MeterReadingRepositoryRemote');
export const METER_READING_REPO_LOCAL =
  new InjectionToken<MeterReadingRepository>('MeterReadingRepositoryLocal');

export const USER_REPO_REMOTE = new InjectionToken<UserRepository>(
  'UserRepositoryRemote'
);
export const USER_REPO_LOCAL = new InjectionToken<UserRepository>(
  'UserRepositoryLocal'
);
