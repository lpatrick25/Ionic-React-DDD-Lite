import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ROLES } from '../../../../../core/constants/api.constants';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserFormData } from '../../../application/dto/user.dto';
import { UserValidator } from '../../../application/services/user-validator.service';
import { AsyncValidatorService } from '../../../../../shared/services/async-validator.service';
import { FormUtilsService } from '../../../../../shared/services/form-utils.service';
import { AbstractFormComponent } from '../../../../../shared/components/form/abstract-form.component';

// Role type from constants
export type Role = (typeof ROLES)[keyof typeof ROLES];

// Define error message structure
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

// Valid form field names
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
export class UserFormComponent
  extends AbstractFormComponent<UserFormData, UserEntity>
  implements OnInit
{
  roles = Object.values(ROLES);

  @Input()
  set user(user: UserEntity | null | undefined) {
    console.log('User input set:', user);
    this.entity = user;
    if (this.form && user) {
      console.log('Calling populateForm from user setter');
      this.populateForm(user);
    }
  }

  constructor(
    fb: FormBuilder,
    modalCtrl: ModalController,
    private userValidator: UserValidator,
    private asyncValidatorService: AsyncValidatorService,
    private formUtilsService: FormUtilsService
  ) {
    super(fb, modalCtrl);
  }

  override ngOnInit() {
    console.log('UserFormComponent ngOnInit', { entity: this.entity });
    super.ngOnInit();
  }

  createForm(): FormGroup {
    console.log('Creating form with entity ID:', this.entity?.id);
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      extensionName: [''],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
        [
          this.asyncValidatorService.createPhoneValidator(
            (phone, excludeId, entityType) =>
              this.userValidator.validatePhone(
                phone,
                excludeId,
                'user' as const
              ),
            this.entity?.id ? Number(this.entity.id) : null,
            'user' as const
          ),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [
          this.asyncValidatorService.createEmailValidator(
            (email, excludeId, entityType) =>
              this.userValidator.validateEmail(
                email,
                excludeId,
                'user' as const
              ),
            this.entity?.id ? Number(this.entity.id) : null,
            'user' as const
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      status: [true],
    });
  }

  populateForm(user: UserEntity): void {
    console.log('Populating form with user:', user);
    this.form.patchValue({
      firstName: user.firstName,
      middleName: user.middleName || '',
      lastName: user.lastName,
      extensionName: user.extensionName || '',
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
      status: user.isActive(),
    });

    if (this.isEditMode) {
      console.log('Clearing async validators for unchanged fields');

      const passwordControl = this.form.get('password');
      if (passwordControl) {
        console.log('Clearing password validators in edit mode');
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  mapFormToData(): UserFormData {
    return {
      firstName: this.form.value.firstName,
      middleName: this.form.value.middleName || null,
      lastName: this.form.value.lastName,
      extensionName: this.form.value.extensionName || null,
      phoneNumber: this.form.value.phoneNumber,
      email: this.form.value.email,
      password: this.form.value.password || undefined,
      role: this.form.value.role,
      status: this.form.value.status,
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      email: 'Email',
      password: 'Password',
      role: 'Role',
    };
  }

  getErrorMessages(): Record<FormFieldName, ErrorMessageConfig> {
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

  getDefaultFormValues(): any {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      phoneNumber: '',
      email: '',
      password: '',
      role: ROLES.CASHIER,
      status: true,
    };
  }
}
