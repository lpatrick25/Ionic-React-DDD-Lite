import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { ConsumerPage } from './presentation/pages/consumer.page';
import { ConsumerFormComponent } from './presentation/components/consumer-form/consumer-form.component';
import { ConsumerListComponent } from './presentation/components/consumer-list/consumer-list.component';

// Infrastructure
import { ConsumerApiRepository } from './infrastructure/consumer-api.repository';

// Application
import { CreateConsumerUseCase } from './application/use-cases/create-consumer.usecase';
import { GetConsumersUseCase } from './application/use-cases/get-consumers.usecase';
import { UpdateConsumerUseCase } from './application/use-cases/update-consumer.usecase';
import { DeleteConsumerUseCase } from './application/use-cases/delete-consumer.usecase';
import { USER_REPOSITORY } from './domain/repositories/consumer.repository';

// 👇 Add child route here
const routes: Routes = [
  {
    path: '',
    component: ConsumerPage
  }
];

@NgModule({
  declarations: [
    ConsumerFormComponent,
    ConsumerListComponent,
    ConsumerPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes) // 👈 important
  ],
  providers: [
    // Infrastructure
    ConsumerApiRepository,

    // Use Cases
    CreateConsumerUseCase,
    GetConsumersUseCase,
    UpdateConsumerUseCase,
    DeleteConsumerUseCase,

    // Repository binding
    { provide: USER_REPOSITORY, useExisting: ConsumerApiRepository }
  ]
})
export class ConsumerModule { }
