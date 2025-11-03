import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';

import { ProfileSettingsPageRoutingModule } from './profile-settings-routing.module';

import { ProfileSettingsPage } from './profile-settings.page';
import { SyncButtonComponent } from '../../components/sync-button/sync-button.component';

// Use Case
import {
  BILLING_REPO_LOCAL,
  BILLING_REPO_REMOTE,
  CONCESSIONAIRE_REPO_LOCAL,
  CONCESSIONAIRE_REPO_REMOTE,
  METER_READING_REPO_LOCAL,
  METER_READING_REPO_REMOTE,
  METER_REPO_LOCAL,
  METER_REPO_REMOTE,
  TARIFF_REPO_LOCAL,
  TARIFF_REPO_REMOTE,
  USER_REPO_LOCAL,
  USER_REPO_REMOTE,
} from '../../../application/use-cases/injection-tokens';
import { SyncDataUseCase } from '../../../application/use-cases/sync-data.usecase';


// Infrastructure Local
import { LocalUserApiRepository } from '../../../infrastructure/repositories/local/local-user-api.repository';
import { LocalConsumerApiRepository } from '../../../infrastructure/repositories/local/local-consumer-api.repository';
import { LocalMeterApiRepository } from '../../../infrastructure/repositories/local/local-meter-api.repository';
import { LocalMeterReadingApiRepository } from '../../../infrastructure/repositories/local/local-meter-reading-api.repository';
import { LocalBillingApiRepository } from '../../../infrastructure/repositories/local/local-billing-api.repository';
import { LocalTariffRateApiRepository } from '../../../infrastructure/repositories/local/local-tariff-rate-api.repository';

// Infrastructure Remote
import { RemoteUserRepository } from '../../../infrastructure/repositories/remote/remote-user-repository';
import { RemoteConsumerRepository } from '../../../infrastructure/repositories/remote/remote-consumer-api.repository';
import { RemoteMeterRepository } from '../../../infrastructure/repositories/remote/remote-meter-api.repository';
import { RemoteMeterReadingRepository } from '../../../infrastructure/repositories/remote/remote-meter-reading-api.repository';
import { RemoteBillingRepository } from '../../../infrastructure/repositories/remote/remote-billing-api.repository';
import { RemoteTariffRateRepository } from '../../../infrastructure/repositories/remote/remote-tariff-rate-api.repository';

// Infrastructure Service
import { SQLiteService } from '../../../infrastructure/services/SQLiteService';
import { ApiService } from '../../../infrastructure/services/ApiService';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileSettingsPageRoutingModule,
    HttpClientModule,
    SyncButtonComponent,
  ],
  declarations: [ProfileSettingsPage],
  providers: [
    //Local
    LocalBillingApiRepository,
    LocalConsumerApiRepository,
    LocalMeterApiRepository,
    LocalMeterReadingApiRepository,
    LocalTariffRateApiRepository,
    LocalUserApiRepository,

    //Remote
    RemoteBillingRepository,
    RemoteConsumerRepository,
    RemoteMeterRepository,
    RemoteMeterReadingRepository,
    RemoteTariffRateRepository,
    RemoteUserRepository,

    //Use Case
    SyncDataUseCase,

    //Service
    ApiService,
    SQLiteService,

    {
      provide: CONCESSIONAIRE_REPO_REMOTE,
      useClass: RemoteConsumerRepository,
    },
    {
      provide: CONCESSIONAIRE_REPO_LOCAL,
      useClass: LocalConsumerApiRepository,
    },

    { provide: METER_REPO_REMOTE, useClass: RemoteMeterRepository },
    { provide: METER_REPO_LOCAL, useClass: LocalMeterApiRepository },

    {
      provide: METER_READING_REPO_REMOTE,
      useClass: RemoteMeterReadingRepository,
    },
    {
      provide: METER_READING_REPO_LOCAL,
      useClass: LocalMeterReadingApiRepository,
    },

    { provide: BILLING_REPO_REMOTE, useClass: RemoteBillingRepository },
    { provide: BILLING_REPO_LOCAL, useClass: LocalBillingApiRepository },

    { provide: TARIFF_REPO_REMOTE, useClass: RemoteTariffRateRepository },
    { provide: TARIFF_REPO_LOCAL, useClass: LocalTariffRateApiRepository },

    { provide: USER_REPO_REMOTE, useClass: RemoteUserRepository },
    { provide: USER_REPO_LOCAL, useClass: LocalUserApiRepository },
  ],
})
export class ProfileSettingsPageModule {}
