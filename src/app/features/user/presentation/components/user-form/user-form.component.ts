import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
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

// Fix: Define valid field names as a union type
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
export class UserFormComponent implements OnChanges, OnInit {
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
    this.isEditMode = !!this.user;

    if (this.user) {
      this.populateForm(this.user);
    }

    // If edit mode, make password optional
    if (this.isEditMode) {
      const passwordControl = this.userForm.get('password');
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user && !this.isEditMode) {
      this.isEditMode = true;
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
      middleName: user.middleName,
      lastName: user.lastName,
      extensionName: user.extensionName,
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
    if (this.userForm.valid) {
      const formData: UserFormData = {
        firstName: this.userForm.value.firstName,
        middleName: this.userForm.value.middleName,
        lastName: this.userForm.value.lastName,
        extensionName: this.userForm.value.extensionName,
        phoneNumber: this.userForm.value.phoneNumber,
        email: this.userForm.value.email,
        password: this.userForm.value.password || undefined,
        role: this.userForm.value.role,
        status: this.userForm.value.status,
      };

      console.log('Form Data to Submit:', formData); // Debug log

      this.modalCtrl.dismiss({
        submitted: true,
        formData: formData,
      });
    } else {
      this.markFormGroupTouched(); // show validation errors
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  get f() {
    return this.userForm.controls;
  }

  // Fix: Use union type for fieldName parameter
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

  // Fix: Properly typed error messages object
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

  // Alternative: More generic error handling method
  getFieldErrorMessage(control: AbstractControl | null): string {
    if (!control?.invalid || !control.touched) return '';

    const errors = control.errors as ValidationErrors | null;
    if (!errors) return '';

    const fieldName =
      control instanceof FormGroup
        ? Object.keys(control.controls)[0]
        : Object.keys(this.userForm.controls).find(
            (key) => this.userForm.get(key) === control
          ) || '';

    const fieldErrors = this.errorMessages[fieldName as FormFieldName];

    if (errors['required']) {
      return fieldErrors?.required || 'This field is required';
    }

    if (errors['email']) {
      return fieldErrors?.email || 'Invalid email format';
    }

    if (errors['minlength']) {
      return (
        fieldErrors?.minlength ||
        `Minimum length is ${(errors['minlength'] as any).requiredLength}`
      );
    }

    if (errors['pattern']) {
      return fieldErrors?.pattern || 'Invalid format';
    }

    // Generic error message for unknown validation errors
    return Object.values(errors)[0]?.toString() || 'Invalid input';
  }

  // Helper method to check if form is valid
  isFormValid(): boolean {
    return this.userForm.valid && this.userForm.touched;
  }

  // Helper method to get form errors count
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

  // Method to mark all fields as touched (for validation display)
  markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsTouched({ onlySelf: true });
      // Recursively mark nested controls
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
