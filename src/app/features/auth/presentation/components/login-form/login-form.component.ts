import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthDto } from '../../../application/dto/auth.dto';

// Error message type for better typing
interface ErrorMessageConfig {
  required?: string;
  email?: string;
  minlength?: string;
}

interface ErrorMessages {
  email: ErrorMessageConfig;
  password: ErrorMessageConfig;
}

type FormFieldName = 'email' | 'password';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: false,
})
export class LoginFormComponent implements OnInit {
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<{
    submitted: boolean;
    formData: AuthDto;
  }>();
  @Output() formCancel = new EventEmitter<void>();

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.loginForm = this.createForm();
  }

  ngOnInit() {}

  /** Initialize the form with validators */
  private createForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  /** Submit handler */
  onSubmit() {
    this.markFormGroupTouched();

    if (this.loginForm.valid) {
      const formData: AuthDto = this.loginForm.value;
      console.log('Login Form Data:', formData);

      this.formSubmit.emit({ submitted: true, formData });
      this.modalCtrl.dismiss({ submitted: true, formData });
    } else {
      console.warn('Login Form invalid:', this.loginForm.errors);
    }
  }

  /** Cancel handler */
  onCancel() {
    this.loginForm.reset();
    this.formCancel.emit();
    this.modalCtrl.dismiss();
  }

  /** Shorthand getter for form controls */
  get f() {
    return this.loginForm.controls;
  }

  /** Strongly typed error messages */
  get errorMessages(): ErrorMessages {
    return {
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
      },
      password: {
        required: 'Password is required',
        minlength: 'Password must be at least 6 characters',
      },
    };
  }

  /** Returns a specific error message for a given field */
  getErrorMessage(fieldName: FormFieldName): string {
    const control = this.loginForm.get(fieldName);
    if (!control?.invalid || !control.touched) return '';

    const errors = control.errors;
    const fieldErrors = this.errorMessages[fieldName];

    if (errors?.['required'])
      return fieldErrors.required || 'This field is required';
    if (errors?.['email']) return fieldErrors.email || 'Invalid email format';
    if (errors?.['minlength'])
      return (
        fieldErrors.minlength ||
        `Minimum length is ${errors['minlength'].requiredLength}`
      );

    return 'Invalid input';
  }

  /** Return all current error messages as an array of strings */
  getFormErrorMessages(): string[] {
    return Object.keys(this.loginForm.controls)
      .map((field) => this.getErrorMessage(field as FormFieldName))
      .filter((msg) => msg.length > 0);
  }

  /** Count total validation errors */
  getFormErrorsCount(): number {
    return Object.values(this.loginForm.controls).reduce((count, control) => {
      return control.errors
        ? count + Object.keys(control.errors).length
        : count;
    }, 0);
  }

  /** Mark all controls as touched (to show errors) */
  private markFormGroupTouched() {
    Object.values(this.loginForm.controls).forEach((control) =>
      control.markAsTouched({ onlySelf: true })
    );
  }
}
