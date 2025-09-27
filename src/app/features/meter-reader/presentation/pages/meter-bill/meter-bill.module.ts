import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MeterBillPageRoutingModule } from './meter-bill-routing.module';
import { MeterReaderPageModule } from '../meter-reader/meter-reader.module';

import { MeterBillPage } from './meter-bill.page';
import { SearchMeterFormComponent } from '../../components/search-meter-form/search-meter-form.component';
import { MeterBillApiRepository } from '../../../infrastructure/meter-bill-api.repository';
import { MeterBillUseCase } from '../../../application/use-cases/meter-bill.usecase';
import { METER_REPOSITORY } from '../../../domain/repositories/meter-bill.repository';
import { MeterReadingUseCase } from '../../../application/use-cases/meter-reading.usecase';
import { MeterReadingApiRepository } from '../../../infrastructure/meter-reading-api.repository';
import { READING_REPOSITORY } from '../../../domain/repositories/meter-reading.repository';
@NgModule({
  declarations: [MeterBillPage, SearchMeterFormComponent],
  imports: [CommonModule, FormsModule, IonicModule, ReactiveFormsModule, MeterBillPageRoutingModule, MeterReaderPageModule],
  providers: [
    //Infrastructure
    MeterBillApiRepository,
    MeterReadingApiRepository,

    // Use Case
    MeterBillUseCase,
    MeterReadingUseCase,

    // Repository Binding
    { provide: METER_REPOSITORY, useExisting: MeterBillApiRepository },
    { provide: READING_REPOSITORY, useExisting: MeterReadingApiRepository }
  ]
})
export class MeterBillPageModule {}
