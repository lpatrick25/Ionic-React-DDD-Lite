import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { MeterPage } from './presentation/pages/meter.page';
import { MeterFormComponent } from './presentation/components/meter-form/meter-form.component';
import { MeterListComponent } from './presentation/components/meter-list/meter-list.component';

// Infrastructure
import { MeterApiRepository } from './infrastructure/meter-api.repository';

// Application
import { CreateMeterUseCase } from './application/use-cases/create-meter.usecase';
import { GetMetersUseCase } from './application/use-cases/get-meters.usecase';
import { UpdateMeterUseCase } from './application/use-cases/update-meter.usecase';
import { DeleteMeterUseCase } from './application/use-cases/delete-meter.usecase';
import { METER_REPOSITORY } from './domain/repositories/meter.repository';
import { GetConsumersUseCase } from '../consumer/application/use-cases/get-consumers.usecase';
import { ConsumerApiRepository } from '../consumer/infrastructure/consumer-api.repository';
import { CONSUMER_REPOSITORY } from '../consumer/domain/repositories/consumer.repository';

const routes: Routes = [
  {
    path: '',
    component: MeterPage
  }
];

@NgModule({
  declarations: [
    MeterFormComponent,
    MeterListComponent,
    MeterPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    // Infrastructure
    MeterApiRepository,

    // Use Cases
    CreateMeterUseCase,
    GetMetersUseCase,
    UpdateMeterUseCase,
    DeleteMeterUseCase,
    GetConsumersUseCase,

    // Repository binding
    { provide: METER_REPOSITORY, useExisting: MeterApiRepository },
    { provide: CONSUMER_REPOSITORY, useExisting: ConsumerApiRepository }
  ]
})
export class MeterModule { }
