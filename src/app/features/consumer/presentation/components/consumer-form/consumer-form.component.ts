import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ADDRESSES } from '../../../../../core/constants/api.constants';
import { ConsumerEntity } from '../../../domain/entities/consumer.entity';
import { ConsumerFormData } from '../../../application/dto/consumer.dto';
import { ModalController } from '@ionic/angular';

// Import types from constants
export type Address = (typeof ADDRESSES)[keyof typeof ADDRESSES];

// Define error message structure with proper typing
interface ErrorMessageConfig {
  required?: string;
  minlength?: string;
  email?: string;
  pattern?: string;
}

interface ErrorMessages {
  firstName: ErrorMessageConfig;
  lastName: ErrorMessageConfig;
  address: ErrorMessageConfig;
  phoneNumber: ErrorMessageConfig;
  email: ErrorMessageConfig;
  password: ErrorMessageConfig;
}

// Define valid field names as a union type
type FormFieldName =
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'address'
  | 'email'
  | 'password';

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

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.consumerForm = this.createForm();
  }

  ngOnInit() {
    // Set edit mode based on whether a consumer is provided
    this.isEditMode = !!this.consumer;

    // Populate form only if in edit mode and consumer is provided
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
      phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      status: [true],
    });
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

    // In edit mode, make password optional
    if (this.isEditMode) {
      const passwordControl = this.consumerForm.get('password');
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();
      }
    }
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched();

    if (this.consumerForm.valid) {
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

      console.log('Form Data to Submit:', formData); // Debug log

      // Emit the form data and let parent handle modal dismissal
      // this.formSubmit.emit({
      //   submitted: true,
      //   formData: formData,
      // });
      this.modalCtrl.dismiss({
        submitted: true,
        formData: this.consumerForm.value,
      });
    } else {
      console.log('Form invalid, validation errors:', this.consumerForm.errors); // Debug log
      // Do NOT reset the form or dismiss the modal
      // Validation errors are displayed via template
    }
  }

  onCancel() {
    // Reset form only on cancel
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
    this.modalCtrl.dismiss(); // Dismiss modal on cancel
  }

  get f() {
    return this.consumerForm.controls;
  }

  getErrorMessage(fieldName: FormFieldName): string {
    const control = this.consumerForm.get(fieldName);
    if (!control?.invalid || !control.touched) return '';

    const errors = control.errors;
    const fieldErrors = this.errorMessages[fieldName];

    if (errors?.['required']) {
      return fieldErrors?.required || 'This field is required';
    }

    if (errors?.['email']) {
      return fieldErrors?.email || 'Invalid email format';
    }

    if (errors?.['minlength']) {
      return (
        fieldErrors?.minlength ||
        `Minimum length is ${errors['minlength'].requiredLength}`
      );
    }

    if (errors?.['pattern']) {
      return fieldErrors?.pattern || 'Invalid format';
    }

    return 'Invalid input';
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
      },
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

  isFormValid(): boolean {
    return this.consumerForm.valid && this.consumerForm.touched;
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
