import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  AsyncValidatorFn,
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';

export interface FormData {
  // Define common form data structure
}

export interface BackendError {
  [key: string]: string[];
}

export interface ErrorMessageConfig {
  required?: string;
  minlength?: string;
  email?: string;
  pattern?: string;
  emailTaken?: string;
  phoneTaken?: string;
  meterNumberTaken?: string;
  backendError?: string;
}

export type FormFieldName = string;

@Directive()
export abstract class AbstractFormComponent<T extends FormData, E>
  implements OnInit
{
  @Input() entity?: E | null;
  @Input() isLoading = false;
  @Input() isEditMode = false;
  @Output() formSubmit = new EventEmitter<{
    submitted: boolean;
    formData: T;
  }>();
  @Output() formCancel = new EventEmitter<void>();

  form!: FormGroup;
  submitted = false;

  abstract createForm(): FormGroup;
  abstract populateForm(entity: E): void;
  abstract mapFormToData(): T;
  abstract getFieldLabels(): Record<FormFieldName, string>;
  abstract getErrorMessages(): Record<FormFieldName, ErrorMessageConfig>;

  constructor(
    protected fb: FormBuilder,
    protected modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.form = this.createForm();
    this.isEditMode = !!this.entity;
    if (this.isEditMode && this.entity) {
      this.populateForm(this.entity);
    }
  }

  onSubmit() {
    this.markFormGroupTouched();
    this.submitted = true;

    if (this.form.valid) {
      const formData = this.mapFormToData();
      this.modalCtrl.dismiss({ submitted: true, formData });
    }
  }

  onCancel() {
    this.resetForm();
    this.formCancel.emit();
    this.modalCtrl.dismiss();
  }

  setBackendErrors(errors: BackendError) {
    Object.entries(errors).forEach(([field, messages]) => {
      const control = this.form.get(field);
      if (control) {
        control.setErrors({ backendError: messages.join(', ') });
        control.markAsTouched();
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  getErrorMessage(fieldName: FormFieldName, includeFieldName = false): string {
    const control = this.form.get(fieldName);
    if (!control?.invalid || !control.touched) return '';

    const errors = control.errors;
    if (!errors) return ''; // Early return if errors is null or undefined

    const fieldErrors = this.getErrorMessages()[fieldName];
    const fieldLabel = this.getFieldLabels()[fieldName] || fieldName;

    const errorMessages: { [key: string]: string } = {
      required: fieldErrors?.required || 'This field is required',
      email: fieldErrors?.email || 'Invalid email format',
      minlength:
        fieldErrors?.minlength ||
        `Minimum length is ${errors['minlength']?.requiredLength ?? 'unknown'}`,
      pattern: fieldErrors?.pattern || 'Invalid format',
      emailTaken: fieldErrors?.emailTaken || 'Email is already taken',
      phoneTaken: fieldErrors?.phoneTaken || 'Phone number is already taken',
      meterNumberTaken:
        fieldErrors?.meterNumberTaken || 'Meter number is already taken',
      backendError: errors['backendError'] || 'Invalid input',
    };

    const errorKey = Object.keys(errors).find((key) => errors[key]);
    if (errorKey && errorKey in errorMessages) {
      return includeFieldName
        ? `${fieldLabel}: ${errorMessages[errorKey]}`
        : errorMessages[errorKey];
    }

    return includeFieldName ? `${fieldLabel}: Invalid input` : 'Invalid input';
  }

  getAllErrorMessages(): string[] {
    const messages: string[] = [];
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control?.invalid && control.touched) {
        const message = this.getErrorMessage(key as FormFieldName, true);
        if (message) messages.push(message);
      }
    });
    return messages;
  }

  getFormErrorsCount(): number {
    return Object.keys(this.form.controls).reduce((count, key) => {
      const controlErrors = this.form.get(key)?.errors;
      return count + (controlErrors ? Object.keys(controlErrors).length : 0);
    }, 0);
  }

  isFormValid(): boolean {
    return this.form.valid && this.form.touched;
  }

  markFormGroupTouched() {
    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
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

  protected resetForm() {
    this.form.reset(this.getDefaultFormValues());
  }

  protected abstract getDefaultFormValues(): any;
}
