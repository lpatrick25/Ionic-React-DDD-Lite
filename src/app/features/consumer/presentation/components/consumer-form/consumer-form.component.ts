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
import { ADDRESSES } from '../../../../../core/constants/api.constants';
import { ConsumerEntity } from '../../../domain/entities/consumer.entity';
import { ConsumerFormData } from '../../../application/dto/consumer.dto';
import { ConsumerValidator } from '../../../application/services/consumer-validator.service';

export type Address = (typeof ADDRESSES)[keyof typeof ADDRESSES];

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
  address: ErrorMessageConfig;
  phoneNumber: ErrorMessageConfig;
  email: ErrorMessageConfig;
}

type FormFieldName = 'firstName' | 'lastName' | 'phoneNumber' | 'address' | 'email';

@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.scss'],
  standalone: false,
})
export class ConsumerFormComponent implements OnInit {
  @Input() consumer?: ConsumerEntity | null;
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<{
    submitted: boolean;
    formData: ConsumerFormData;
  }>();
  @Output() formCancel = new EventEmitter<void>();

  consumerForm: FormGroup;
  addresses = Object.values(ADDRESSES);
  isEditMode = false;
  showErrorSummary = true; // New property to control summary visibility

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private consumerValidator: ConsumerValidator
  ) {
    this.consumerForm = this.createForm();
  }

  ngOnInit() {
    this.isEditMode = !!this.consumer;
    if (this.isEditMode && this.consumer) {
      this.populateForm(this.consumer);
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      extensionName: [''],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
        [this.phoneValidator()],
      ],
      email: ['', [Validators.required, Validators.email], [this.emailValidator()]],
      status: [true],
    });
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return this.consumerValidator.validateEmail(control.value).pipe(
        map((isTaken) => (isTaken ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private phoneValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return this.consumerValidator.validatePhone(control.value).pipe(
        map((isTaken) => (isTaken ? { phoneTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private populateForm(consumer: ConsumerEntity) {
    this.consumerForm.patchValue({
      firstName: consumer.firstName,
      middleName: consumer.middleName || '',
      lastName: consumer.lastName,
      extensionName: consumer.extensionName || '',
      address: consumer.address,
      phoneNumber: consumer.phoneNumber,
      email: consumer.email,
      status: consumer.isActive(),
    });

    if (this.isEditMode && this.consumer) {
      const emailControl = this.consumerForm.get('email');
      const phoneControl = this.consumerForm.get('phoneNumber');
      if (emailControl?.value === this.consumer.email) {
        emailControl.clearAsyncValidators();
        emailControl.updateValueAndValidity({ emitEvent: false });
      }
      if (phoneControl?.value === this.consumer.phoneNumber) {
        phoneControl.clearAsyncValidators();
        phoneControl.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  onSubmit() {
    this.markFormGroupTouched();
    this.showErrorSummary = true; // Show summary on submit if errors exist

    if (this.consumerForm.pending) {
      this.consumerForm.statusChanges.subscribe((status) => {
        if (status === 'VALID') {
          this.submitForm();
        } else if (status === 'INVALID') {
          console.log('Form invalid, validation errors:', this.consumerForm.errors);
        }
      });
    } else if (this.consumerForm.valid) {
      this.submitForm();
    } else {
      console.log('Form invalid, validation errors:', this.consumerForm.errors);
    }
  }

  private submitForm() {
    const formData: ConsumerFormData = {
      firstName: this.consumerForm.value.firstName,
      middleName: this.consumerForm.value.middleName || null,
      lastName: this.consumerForm.value.lastName,
      extensionName: this.consumerForm.value.extensionName || null,
      address: this.consumerForm.value.address,
      phoneNumber: this.consumerForm.value.phoneNumber,
      email: this.consumerForm.value.email,
      status: this.consumerForm.value.status,
    };

    console.log('Form Data to Submit:', formData);

    this.consumerValidator.validate(formData).subscribe({
      next: () => {
        this.modalCtrl.dismiss({
          submitted: true,
          formData,
        });
      },
      error: (err) => {
        console.error('Validation failed:', err.message);
        this.showErrorSummary = true; // Ensure summary is shown on validation error
        if (err.message.includes('Email')) {
          this.f['email'].setErrors({ emailTaken: true });
        } else if (err.message.includes('Phone')) {
          this.f['phoneNumber'].setErrors({ phoneTaken: true });
        }
      },
    });
  }

  onCancel() {
    this.consumerForm.reset({
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      address: '',
      phoneNumber: '',
      email: '',
      status: true,
    });
    this.formCancel.emit();
    this.modalCtrl.dismiss();
  }

  dismissErrorSummary() {
    this.showErrorSummary = false; // Hide the error summary
  }

  get f() {
    return this.consumerForm.controls;
  }

  getErrorMessage(fieldName: FormFieldName, includeFieldName: boolean = false): string {
    const control = this.consumerForm.get(fieldName);
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
    return includeFieldName ? `${fieldLabel}: Invalid input` : 'Invalid input';
  }

  getAllErrorMessages(): string[] {
    if (!this.showErrorSummary) return []; // Return empty array if summary is dismissed
    const errorMessages: string[] = [];
    Object.keys(this.consumerForm.controls).forEach((key) => {
      const control = this.consumerForm.get(key);
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
      address: 'Address',
      phoneNumber: 'Phone Number',
      email: 'Email',
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
      address: {
        required: 'Address is required',
        minlength: 'Address must be at least 5 characters',
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
    };
  }

  getFormErrorsCount(): number {
    let count = 0;
    Object.keys(this.consumerForm.controls).forEach((key) => {
      const controlErrors = this.consumerForm.get(key)?.errors;
      if (controlErrors) {
        count += Object.keys(controlErrors).length;
      }
    });
    return count;
  }

  markFormGroupTouched() {
    Object.keys(this.consumerForm.controls).forEach((key) => {
      const control = this.consumerForm.get(key);
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
