import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ROLES } from '../../../../../core/constants/api.constants';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserFormData } from '../../../application/dto/user.dto';
import { ModalController } from '@ionic/angular';

// Import types from constants
export type Role = (typeof ROLES)[keyof typeof ROLES];

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
  phoneNumber: ErrorMessageConfig;
  email: ErrorMessageConfig;
  password: ErrorMessageConfig;
}

// Define valid field names as a union type
type FormFieldName =
  | 'firstName'
  | 'lastName'
  | 'phoneNumber'
  | 'email'
  | 'password';

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

  constructor(private fb: FormBuilder, private modalCtrl: ModalController) {
    this.userForm = this.createForm();
  }

  ngOnInit() {
    // Set edit mode based on whether a user is provided
    this.isEditMode = !!this.user;

    // Populate form only if in edit mode and user is provided
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
      phoneNumber: ['', [Validators.required, Validators.pattern(/^09\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)],
      ],
      role: [ROLES.CASHIER, Validators.required],
      status: [true],
    });
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

    // In edit mode, make password optional
    if (this.isEditMode) {
      const passwordControl = this.userForm.get('password');
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();
      }
    }
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched();

    if (this.userForm.valid) {
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

      console.log('Form Data to Submit:', formData); // Debug log

      // Emit the form data and let parent handle modal dismissal
      // this.formSubmit.emit({
      //   submitted: true,
      //   formData: formData,
      // });
      this.modalCtrl.dismiss({
        submitted: true,
        formData: this.userForm.value,
      });
    } else {
      console.log('Form invalid, validation errors:', this.userForm.errors); // Debug log
      // Do NOT reset the form or dismiss the modal
      // Validation errors are displayed via template
    }
  }

  onCancel() {
    // Reset form only on cancel
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
    this.modalCtrl.dismiss(); // Dismiss modal on cancel
  }

  get f() {
    return this.userForm.controls;
  }

  getErrorMessage(fieldName: FormFieldName): string {
    const control = this.userForm.get(fieldName);
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
    return this.userForm.valid && this.userForm.touched;
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
