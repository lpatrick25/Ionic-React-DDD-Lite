import { InjectionToken } from '@angular/core';
import { ConcessionaireRepository } from '../../domain/repositories/ConcessionaireRepository';
import { MeterRepository } from '../../domain/repositories/MeterRepository';
import { BillingRepository } from '../../domain/repositories/BillingRepository';
import { TariffRateRepository } from '../../domain/repositories/TariffRateRepository';
import { MeterReadingRepository } from '../../domain/repositories/MeterReadingRepository';
import { UserRepository } from '../../domain/repositories/UserRepository';

export const CONCESSIONAIRE_REPO_REMOTE =
  new InjectionToken<ConcessionaireRepository>(
    'ConcessionaireRepositoryRemote'
  );
export const CONCESSIONAIRE_REPO_LOCAL =
  new InjectionToken<ConcessionaireRepository>('ConcessionaireRepositoryLocal');

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
