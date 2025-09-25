import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { ROLES } from '../../../../../core/constants/api.constants';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserFormData } from '../../../application/dto/user.dto';
import { UserValidator } from '../../../application/services/user-validator.service';

export type Role = (typeof ROLES)[keyof typeof ROLES];

interface ErrorMessageConfig {
  required?: string;
  minlength?: string;
  email?: string;
  pattern?: string;
  emailTaken?: string;
  phoneTaken?: string;
}

interface ErrorMessages {
  firstName: ErrorMessageConfig;
  lastName: ErrorMessageConfig;
  phoneNumber: ErrorMessageConfig;
  email: ErrorMessageConfig;
  password: ErrorMessageConfig;
  role: ErrorMessageConfig;
}

type FormFieldName =
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'email'
  | 'password'
  | 'role';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: false,
})
export class UserFormComponent implements OnInit {
  @Input() user?: UserEntity | null;
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<{
    submitted: boolean;
    formData: UserFormData;
  }>();
  @Output() formCancel = new EventEmitter<void>();

  userForm: FormGroup;
  roles = Object.values(ROLES);
  isEditMode = false;
  showErrorSummary = true;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private userValidator: UserValidator
  ) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    this.isEditMode = !!this.user;
    if (this.isEditMode && this.user) {
      this.populateForm(this.user);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      extensionName: [''],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
        [this.phoneValidator()],
      ],
      email: ['', [Validators.required, Validators.email], [this.emailValidator()]],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)],
      ],
      role: ['', Validators.required],
      status: [true],
    });
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return this.userValidator.validateEmail(control.value).pipe(
        map((isTaken) => (isTaken ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private phoneValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return this.userValidator.validatePhone(control.value).pipe(
        map((isTaken) => (isTaken ? { phoneTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private populateForm(user: UserEntity) {
    this.userForm.patchValue({
      firstName: user.firstName,
      middleName: user.middleName || '',
      lastName: user.lastName,
      extensionName: user.extensionName || '',
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      status: user.isActive(),
    });

    if (this.isEditMode && this.user) {
      const passwordControl = this.userForm.get('password');
      const emailControl = this.userForm.get('email');
      const phoneControl = this.userForm.get('phoneNumber');
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity({ emitEvent: false });
      }
      if (emailControl?.value === this.user.email) {
        emailControl.clearAsyncValidators();
        emailControl.updateValueAndValidity({ emitEvent: false });
      }
      if (phoneControl?.value === this.user.phoneNumber) {
        phoneControl.clearAsyncValidators();
        phoneControl.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  onSubmit() {
    this.markFormGroupTouched();
    this.showErrorSummary = true;

    if (this.userForm.pending) {
      this.userForm.statusChanges.subscribe((status) => {
        if (status === 'VALID') {
          this.submitForm();
        } else if (status === 'INVALID') {
          console.log('Form invalid, validation errors:', this.userForm.errors);
        }
      });
    } else if (this.userForm.valid) {
      this.submitForm();
    } else {
      console.log('Form invalid, validation errors:', this.userForm.errors);
    }
  }

  private submitForm() {
    const formData: UserFormData = {
      firstName: this.userForm.value.firstName,
      middleName: this.userForm.value.middleName || null,
      lastName: this.userForm.value.lastName,
      extensionName: this.userForm.value.extensionName || null,
      phoneNumber: this.userForm.value.phoneNumber,
      email: this.userForm.value.email,
      password: this.userForm.value.password || undefined,
      role: this.userForm.value.role,
      status: this.userForm.value.status,
    };

    console.log('Form Data to Submit:', formData);

    this.formSubmit.emit({
      submitted: true,
      formData,
    });
  }

  onCancel() {
    this.userForm.reset({
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      phoneNumber: '',
      email: '',
      password: '',
      role: ROLES.CASHIER,
      status: true,
    });
    this.formCancel.emit();
    this.modalCtrl.dismiss();
  }

  dismissErrorSummary() {
    this.showErrorSummary = false;
  }

  setBackendErrors(errors: { [key: string]: string[] }) {
    Object.entries(errors).forEach(([field, messages]) => {
      const control = this.userForm.get(field);
      if (control) {
        control.setErrors({ backendError: messages.join(', ') });
        control.markAsTouched();
      }
    });
    this.showErrorSummary = true;
  }

  get f() {
    return this.userForm.controls;
  }

  getErrorMessage(fieldName: FormFieldName, includeFieldName: boolean = false): string {
    const control = this.userForm.get(fieldName);
    if (!control?.invalid || !control.touched) return '';

    const errors = control.errors;
    const fieldErrors = this.errorMessages[fieldName];
    const fieldLabel = this.getFieldLabel(fieldName);

    if (errors?.['required']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.required || 'This field is required'}`
        : fieldErrors?.required || 'This field is required';
    }
    if (errors?.['email']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.email || 'Invalid email format'}`
        : fieldErrors?.email || 'Invalid email format';
    }
    if (errors?.['minlength']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.minlength || `Minimum length is ${errors['minlength'].requiredLength}`}`
        : fieldErrors?.minlength || `Minimum length is ${errors['minlength'].requiredLength}`;
    }
    if (errors?.['pattern']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.pattern || 'Invalid format'}`
        : fieldErrors?.pattern || 'Invalid format';
    }
    if (errors?.['emailTaken']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.emailTaken || 'Email is already taken'}`
        : fieldErrors?.emailTaken || 'Email is already taken';
    }
    if (errors?.['phoneTaken']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.phoneTaken || 'Phone number is already taken'}`
        : fieldErrors?.phoneTaken || 'Phone number is already taken';
    }
    if (errors?.['backendError']) {
      return includeFieldName
        ? `${fieldLabel}: ${errors['backendError']}`
        : errors['backendError'];
    }
    return includeFieldName ? `${fieldLabel}: Invalid input` : 'Invalid input';
  }

  getAllErrorMessages(): string[] {
    if (!this.showErrorSummary) return [];
    const errorMessages: string[] = [];
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      if (
        control?.invalid &&
        control.touched &&
        (key as FormFieldName) in this.errorMessages
      ) {
        const message = this.getErrorMessage(key as FormFieldName, true);
        if (message) {
          errorMessages.push(message);
        }
      }
    });
    return errorMessages;
  }

  private getFieldLabel(fieldName: FormFieldName): string {
    const labels: Record<FormFieldName, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      password: 'Password',
      role: 'Role',
    };
    return labels[fieldName] || fieldName;
  }

  get errorMessages(): ErrorMessages {
    return {
      firstName: {
        required: 'First name is required',
        minlength: 'First name must be at least 2 characters',
      },
      lastName: {
        required: 'Last name is required',
        minlength: 'Last name must be at least 2 characters',
      },
      phoneNumber: {
        required: 'Phone number is required',
        pattern: 'Phone number must be in format 09xxxxxxxxx',
        phoneTaken: 'Phone number is already taken',
      },
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
        emailTaken: 'Email is already taken',
      },
      password: {
        required: 'Password is required',
        minlength: 'Password must be at least 6 characters',
      },
      role: {
        required: 'Role is required',
      },
    };
  }

  getFormErrorsCount(): number {
    let count = 0;
    Object.keys(this.userForm.controls).forEach((key) => {
      const controlErrors = this.userForm.get(key)?.errors;
      if (controlErrors) {
        count += Object.keys(controlErrors).length;
      }
    });
    return count;
  }

  markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched({ onlySelf: true });
      if (control instanceof FormGroup) {
        this.markFormGroupTouchedRecursive(control);
      }
    });
  }

  private markFormGroupTouchedRecursive(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
      if (control instanceof FormGroup) {
        this.markFormGroupTouchedRecursive(control);
      }
    });
  }
}
