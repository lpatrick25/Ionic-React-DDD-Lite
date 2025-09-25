import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { UserPage } from './presentation/pages/user.page';
import { UserFormComponent } from './presentation/components/user-form/user-form.component';
import { UserListComponent } from './presentation/components/user-list/user-list.component';

// Infrastructure
import { UserApiRepository } from './infrastructure/user-api.repository';

// Application
import { CreateUserUseCase } from './application/use-cases/create-user.usecase';
import { GetUsersUseCase } from './application/use-cases/get-users.usecase';
import { UpdateUserUseCase } from './application/use-cases/update-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/delete-user.usecase';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { UserValidator } from './application/services/user-validator.service';

// 👇 Add child route here
const routes: Routes = [
  {
    path: '',
    component: UserPage
  }
];

@NgModule({
  declarations: [
    UserFormComponent,
    UserListComponent,
    UserPage
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
    UserApiRepository,

    // Use Cases
    CreateUserUseCase,
    GetUsersUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,

    UserValidator,

    // Repository binding
    { provide: USER_REPOSITORY, useExisting: UserApiRepository }
  ]
})
export class UserModule { }
