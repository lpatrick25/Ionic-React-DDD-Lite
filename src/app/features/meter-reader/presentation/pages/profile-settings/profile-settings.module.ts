import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileSettingsPageRoutingModule } from './profile-settings-routing.module';

import { ProfileSettingsPage } from './profile-settings.page';
import { LocalBillingRepository } from '../../../infrastructure/repositories/local/LocalBillingRepository';
import { LocalConcessionaireRepository } from '../../../infrastructure/repositories/local/LocalConcessionaireRepository';
import { LocalMeterRepository } from '../../../infrastructure/repositories/local/LocalMeterRepository';
import { LocalTariffRateRepository } from '../../../infrastructure/repositories/local/LocalTariffRateRepository';
import { RemoteBillingRepository } from '../../../infrastructure/repositories/remote/RemoteBillingRepository';
import { RemoteConcessionaireRepository } from '../../../infrastructure/repositories/remote/RemoteConcessionaireRepository';
import { RemoteMeterRepository } from '../../../infrastructure/repositories/remote/RemoteMeterRepository';
import { RemoteTariffRateRepository } from '../../../infrastructure/repositories/remote/RemoteTariffRateRepository';
import { SyncDataUseCase } from '../../../application/use-cases/SyncDataUseCase';
import { HttpClientModule } from '@angular/common/http';
import { SQLiteService } from '../../../infrastructure/services/SQLiteService';
import { ApiService } from '../../../infrastructure/services/ApiService';
import { RemoteMeterReadingRepository } from '../../../infrastructure/repositories/remote/RemoteMeterReadingRepository';
import { LocalMeterReadingRepository } from '../../../infrastructure/repositories/local/LocalMeterReadingRepository';
import { SyncButtonComponent } from '../../components/sync-button/sync-button.component';
import { BILLING_REPO_LOCAL, BILLING_REPO_REMOTE, CONCESSIONAIRE_REPO_LOCAL, CONCESSIONAIRE_REPO_REMOTE, METER_READING_REPO_LOCAL, METER_READING_REPO_REMOTE, METER_REPO_LOCAL, METER_REPO_REMOTE, TARIFF_REPO_LOCAL, TARIFF_REPO_REMOTE, USER_REPO_LOCAL, USER_REPO_REMOTE } from '../../../application/use-cases/injection-tokens';
import { RemoteUserRepository } from '../../../infrastructure/repositories/remote/RemoteUserRepository';
import { LocalUserRepository } from '../../../infrastructure/repositories/local/LocalUserRepository';

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
    LocalBillingRepository,
    LocalConcessionaireRepository,
    LocalMeterRepository,
    LocalMeterReadingRepository,
    LocalTariffRateRepository,
    LocalUserRepository,

    //Remote
    RemoteBillingRepository,
    RemoteConcessionaireRepository,
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
      useClass: RemoteConcessionaireRepository,
    },
    {
      provide: CONCESSIONAIRE_REPO_LOCAL,
      useClass: LocalConcessionaireRepository,
    },

    { provide: METER_REPO_REMOTE, useClass: RemoteMeterRepository },
    { provide: METER_REPO_LOCAL, useClass: LocalMeterRepository },

    {
      provide: METER_READING_REPO_REMOTE,
      useClass: RemoteMeterReadingRepository,
    },
    {
      provide: METER_READING_REPO_LOCAL,
      useClass: LocalMeterReadingRepository,
    },

    { provide: BILLING_REPO_REMOTE, useClass: RemoteBillingRepository },
    { provide: BILLING_REPO_LOCAL, useClass: LocalBillingRepository },

    { provide: TARIFF_REPO_REMOTE, useClass: RemoteTariffRateRepository },
    { provide: TARIFF_REPO_LOCAL, useClass: LocalTariffRateRepository },

    { provide: USER_REPO_REMOTE, useClass: RemoteUserRepository },
    { provide: USER_REPO_LOCAL, useClass: LocalUserRepository },
  ],
})
export class ProfileSettingsPageModule {}
