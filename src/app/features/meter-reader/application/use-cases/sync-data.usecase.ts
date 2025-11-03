import { Inject, Injectable } from '@angular/core';
import {
  CONCESSIONAIRE_REPO_REMOTE,
  CONCESSIONAIRE_REPO_LOCAL,
  METER_REPO_REMOTE,
  METER_REPO_LOCAL,
  METER_READING_REPO_REMOTE,
  METER_READING_REPO_LOCAL,
  BILLING_REPO_REMOTE,
  BILLING_REPO_LOCAL,
  TARIFF_REPO_REMOTE,
  TARIFF_REPO_LOCAL,
  USER_REPO_REMOTE,
  USER_REPO_LOCAL,
} from './injection-tokens';
import { ConsumerRepository } from '../../domain/repositories/consumer.repository';
import { MeterRepository } from '../../domain/repositories/meter.repository';
import { MeterReadingRepository } from '../../domain/repositories/meter-readings.repository';
import { BillingRepository } from '../../domain/repositories/billing.repository';
import { TariffRateRepository } from '../../domain/repositories/tariff-rate.repository';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({ providedIn: 'root' })
export class SyncDataUseCase {
  constructor(
    @Inject(USER_REPO_REMOTE)
    private remoteUserRepo: UserRepository,
    @Inject(USER_REPO_LOCAL)
    private localUserRepo: UserRepository,

    @Inject(CONCESSIONAIRE_REPO_REMOTE)
    private remoteConsumerRepo: ConsumerRepository,
    @Inject(CONCESSIONAIRE_REPO_LOCAL)
    private localConsumerRepo: ConsumerRepository,

    @Inject(METER_REPO_REMOTE)
    private remoteMeterRepo: MeterRepository,
    @Inject(METER_REPO_LOCAL)
    private localMeterRepo: MeterRepository,

    @Inject(METER_READING_REPO_REMOTE)
    private remoteMeterReadingRepo: MeterReadingRepository,
    @Inject(METER_READING_REPO_LOCAL)
    private localMeterReadingRepo: MeterReadingRepository,

    @Inject(BILLING_REPO_REMOTE)
    private remoteBillingRepo: BillingRepository,
    @Inject(BILLING_REPO_LOCAL)
    private localBillingRepo: BillingRepository,

    @Inject(TARIFF_REPO_REMOTE)
    private remoteTariffRateRepo: TariffRateRepository,
    @Inject(TARIFF_REPO_LOCAL)
    private localTariffRateRepo: TariffRateRepository
  ) {}

  async execute(): Promise<void> {
    // 1. Pull remote data in parallel
    const [
      users,
      consumers,
      meters,
      meterReadings,
      billings,
      tariffRates,
    ] = await Promise.all([
      this.remoteUserRepo.getAll(),
      this.remoteConsumerRepo.getAll(),
      this.remoteMeterRepo.getAll(),
      this.remoteMeterReadingRepo.getAll(),
      this.remoteBillingRepo.getAll(),
      this.remoteTariffRateRepo.getAll(),
    ]);

    // 2. Clear local data in CHILD → PARENT order
    await this.localBillingRepo.clear();
    await this.localMeterReadingRepo.clear();
    await this.localMeterRepo.clear();
    await this.localConsumerRepo.clear();
    await this.localUserRepo.clear();
    await this.localTariffRateRepo.clear();

    // 3. Save in PARENT → CHILD order
    await this.localUserRepo.saveAll(users);
    await this.localConsumerRepo.saveAll(consumers);
    await this.localMeterRepo.saveAll(meters);
    await this.localMeterReadingRepo.saveAll(meterReadings);
    await this.localBillingRepo.saveAll(billings);
    await this.localTariffRateRepo.saveAll(tariffRates);
  }
}
