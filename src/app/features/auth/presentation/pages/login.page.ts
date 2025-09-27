import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { AuthUseCase } from '../../application/use-cases/auth.usecase';
import { AuthDto } from '../../application/dto/auth.dto';
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
    private loginUseCase: AuthUseCase,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('LoginPage initialized'); // Debug log
  }

  async onLogin(formData: AuthDto) {
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

          console.log(auth.role);

          if (auth.role == 'Admin') {
            this.router.navigate(['/users'], { replaceUrl: true });
          } else {
            this.router.navigate(['/meter-reader'], { replaceUrl: true });
          }
        },
        error: (error) => {
          console.error('Login error 456:', error);

          // Default message
          let errorMessage = 'Login failed';

          // Extract backend error message
          if (error.error && error.error.error) {
            errorMessage = error.error.error; // "Invalid email or password"
          } else if (error.message) {
            errorMessage = error.message;
          }

          // Extract validation errors if available
          const validationErrors = error.error?.errors as
            | { [key: string]: string[] }
            | undefined;

          if (validationErrors && Object.keys(validationErrors).length > 0) {
            errorMessage +=
              ': ' +
              Object.entries(validationErrors)
                .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                .join('; ');
          }

          this.showErrorMessage(errorMessage);
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
      position: 'bottom',
    });
    await toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
      position: 'bottom',
      buttons: [{ text: 'Close', role: 'cancel' }],
    });
    await toast.present();
  }
}
