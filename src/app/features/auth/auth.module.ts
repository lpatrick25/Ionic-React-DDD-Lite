import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginFormComponent } from './presentation/components/login-form/login-form.component';
import { AuthUseCase } from './application/use-cases/auth.usecase';
import { AuthApiRepository } from './infrastructure/auth-api.repository';
import { SharedButtonComponent } from 'src/app/shared/components/shared-button/shared-button.component';
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { LoginPage } from './presentation/pages/login.page';
import { SharedInputComponent } from 'src/app/shared/components/shared-input/shared-input.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
];

@NgModule({
  declarations: [LoginFormComponent, LoginPage],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedButtonComponent,
    SharedInputComponent,
    RouterModule.forChild(routes),
  ],
  providers: [
    // Infrastructure
    AuthApiRepository,

    // Use Cases
    AuthUseCase,

    {
      provide: AUTH_REPOSITORY,
      useExisting: AuthApiRepository,
    },
  ],
})
export class AuthModule {}
