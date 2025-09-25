import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AuthDto } from '../../../application/dto/auth.dto';
import { AbstractFormComponent } from '../../../../../shared/components/form/abstract-form.component';

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
export class LoginFormComponent
  extends AbstractFormComponent<AuthDto, never>
  implements OnInit, OnChanges
{
  constructor(fb: FormBuilder, modalCtrl: ModalController) {
    super(fb, modalCtrl);
  }

  override ngOnInit() {
    console.log('LoginFormComponent ngOnInit');
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('LoginFormComponent ngOnChanges', changes);
  }

  createForm(): FormGroup {
    console.log('Creating login form');
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  override onSubmit() {
    this.markFormGroupTouched();
    this.submitted = true;

    if (this.form.valid) {
      const formData: AuthDto = this.form.value;
      console.log('Login Form Data:', formData);

      this.formSubmit.emit({ submitted: true, formData });
      this.modalCtrl.dismiss({ submitted: true, formData });
    } else {
      console.warn('Login Form invalid:', this.form.errors);
    }
  }

  populateForm(_entity: never): void {
    // No-op: Login form doesn't use entity population
    console.log('populateForm called (no-op for LoginFormComponent)');
  }

  mapFormToData(): AuthDto {
    return {
      email: this.form.value.email,
      password: this.form.value.password,
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      email: 'Email',
      password: 'Password',
    };
  }

  getErrorMessages(): Record<FormFieldName, ErrorMessageConfig> {
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

  getDefaultFormValues(): any {
    return {
      email: '',
      password: '',
    };
  }
}
