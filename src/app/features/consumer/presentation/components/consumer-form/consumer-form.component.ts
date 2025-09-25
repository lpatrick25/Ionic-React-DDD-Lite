import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ADDRESSES } from '../../../../../core/constants/api.constants';
import { ConsumerEntity } from '../../../domain/entities/consumer.entity';
import { ConsumerFormData } from '../../../application/dto/consumer.dto';
import { ConsumerValidator } from '../../../application/services/consumer-validator.service';
import { AsyncValidatorService } from '../../../../../shared/services/async-validator.service';
import { FormUtilsService } from '../../../../../shared/services/form-utils.service';
import { AbstractFormComponent } from '../../../../../shared/components/form/abstract-form.component';

// Address type from constants
export type Address = (typeof ADDRESSES)[keyof typeof ADDRESSES];

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
  address: ErrorMessageConfig;
  phoneNumber: ErrorMessageConfig;
  email: ErrorMessageConfig;
}

// Valid form field names
type FormFieldName =
  | 'firstName'
  | 'lastName'
  | 'address'
  | 'phoneNumber'
  | 'email';

@Component({
  selector: 'app-consumer-form',
  templateUrl: './consumer-form.component.html',
  styleUrls: ['./consumer-form.component.scss'],
  standalone: false,
})
export class ConsumerFormComponent
  extends AbstractFormComponent<ConsumerFormData, ConsumerEntity>
  implements OnInit
{
  addresses = Object.values(ADDRESSES);

  @Input()
  set consumer(consumer: ConsumerEntity | null | undefined) {
    console.log('Consumer input set:', consumer);
    this.entity = consumer;
    if (this.form && consumer) {
      console.log('Calling populateForm from consumer setter');
      this.populateForm(consumer);
    }
  }

  constructor(
    fb: FormBuilder,
    modalCtrl: ModalController,
    private consumerValidator: ConsumerValidator,
    private asyncValidatorService: AsyncValidatorService,
    private formUtilsService: FormUtilsService
  ) {
    super(fb, modalCtrl);
  }

  override ngOnInit() {
    console.log('ConsumerFormComponent ngOnInit', { entity: this.entity });
    super.ngOnInit();
  }

  createForm(): FormGroup {
    console.log('Creating form with entity ID:', this.entity?.id);
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      extensionName: [''],
      address: ['', [Validators.required, Validators.minLength(5)]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^09\d{9}$/)],
        [
          this.asyncValidatorService.createPhoneValidator(
            (phone, excludeId, entityType) =>
              this.consumerValidator.validatePhone(
                phone,
                excludeId,
                'concessionaire' as const
              ),
            this.entity?.id ? Number(this.entity.id) : null,
            'concessionaire' as const
          ),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [
          this.asyncValidatorService.createEmailValidator(
            (email, excludeId, entityType) =>
              this.consumerValidator.validateEmail(
                email,
                excludeId,
                'concessionaire' as const
              ),
            this.entity?.id ? Number(this.entity.id) : null,
            'concessionaire' as const
          ),
        ],
      ],
      status: [true],
    });
  }

  populateForm(consumer: ConsumerEntity): void {
    console.log('Populating form with consumer:', consumer);
    this.form.patchValue({
      firstName: consumer.firstName,
      middleName: consumer.middleName || '',
      lastName: consumer.lastName,
      extensionName: consumer.extensionName || '',
      address: consumer.address,
      phoneNumber: consumer.phoneNumber,
      email: consumer.email,
      status: consumer.isActive(),
    });
  }

  mapFormToData(): ConsumerFormData {
    return {
      firstName: this.form.value.firstName,
      middleName: this.form.value.middleName || null,
      lastName: this.form.value.lastName,
      extensionName: this.form.value.extensionName || null,
      address: this.form.value.address,
      phoneNumber: this.form.value.phoneNumber,
      email: this.form.value.email,
      status: this.form.value.status,
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      firstName: 'First Name',
      lastName: 'Last Name',
      address: 'Address',
      phoneNumber: 'Phone Number',
      email: 'Email',
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

  getDefaultFormValues(): any {
    return {
      firstName: '',
      middleName: '',
      lastName: '',
      extensionName: '',
      address: '',
      phoneNumber: '',
      email: '',
      status: true,
    };
  }
}
