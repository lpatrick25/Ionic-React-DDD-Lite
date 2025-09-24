import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { LoginUseCase } from '../../application/use-cases/login.usecase';
import { LoginDto } from '../../application/dto/auth.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  isLoading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private loginUseCase: LoginUseCase,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('LoginPage initialized'); // Debug log
  }

  async onLogin(formData: LoginDto) {
    console.log('Handling login submit:', formData); // Debug log
    this.isLoading$.next(true);

    const loading = await this.loadingController.create({
      message: 'Logging in...',
    });
    await loading.present();

    this.loginUseCase
      .execute(formData)
      .pipe(
        finalize(async () => {
          this.isLoading$.next(false);
          await loading.dismiss();
        })
      )
      .subscribe({
        next: (auth: AuthEntity) => {
          console.log('Login successful:', auth); // Debug log
          this.showSuccessMessage('Login successful');

          this.router.navigate(['/users'], { replaceUrl: true });
        },
        error: (error) => {
          console.error('Login error:', error); // Debug log
          const errorMessage = error.message || 'Login failed';
          const validationErrors = error.errors as
            | { [key: string]: string[] }
            | undefined;
          let detailedMessage = errorMessage;
          if (validationErrors && Object.keys(validationErrors).length > 0) {
            detailedMessage +=
              ': ' +
              Object.entries(validationErrors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('; ');
          }
          this.showErrorMessage(detailedMessage);
        },
      });
  }

  onCancel() {
    console.log('Login cancelled');
    // e.g., redirect back to home or clear form
  }

  private async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
      position: 'top',
      buttons: [{ text: 'Close', role: 'cancel' }],
    });
    await toast.present();
  }
}
