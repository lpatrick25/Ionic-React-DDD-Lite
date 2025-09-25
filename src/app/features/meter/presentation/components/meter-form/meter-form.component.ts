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
import { ADDRESSES } from '../../../../../core/constants/api.constants';
import { MeterEntity } from '../../../domain/entities/meter.entity';
import { MeterFormData } from '../../../application/dto/meter.dto';
import { ModalController } from '@ionic/angular';
import { GetConsumersUseCase } from '../../../../consumer/application/use-cases/get-consumers.usecase';
import { Consumer } from 'src/app/features/consumer/domain/entities/consumer.entity';
import { MeterValidator } from '../../../application/services/meter-validator.service';

// Import types from constants
export type Address = (typeof ADDRESSES)[keyof typeof ADDRESSES];

// Define error message structure with proper typing
interface ErrorMessageConfig {
  required?: string;
  minlength?: string;
  pattern?: string;
  meterNumberTaken?: string;
}

interface ErrorMessages {
  concessionaireId: ErrorMessageConfig;
  meterNumber: ErrorMessageConfig;
  installationDate: ErrorMessageConfig;
  serviceAddress: ErrorMessageConfig;
}

// Define valid field names as a union type
type FormFieldName =
  | 'concessionaireId'
  | 'meterNumber'
  | 'installationDate'
  | 'serviceAddress';

@Component({
  selector: 'app-meter-form',
  templateUrl: './meter-form.component.html',
  styleUrls: ['./meter-form.component.scss'],
  standalone: false,
})
export class MeterFormComponent implements OnInit {
  @Input() meter?: MeterEntity | null;
  @Input() isLoading = false;
  @Output() formSubmit = new EventEmitter<{
    submitted: boolean;
    formData: MeterFormData;
  }>();
  @Output() formCancel = new EventEmitter<void>();

  meterForm: FormGroup;
  addresses = Object.values(ADDRESSES);
  isEditMode = false;

  // consumer list
  consumers: Consumer[] = [];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private getConsumersUseCase: GetConsumersUseCase,
    private meterValidator: MeterValidator
  ) {
    this.meterForm = this.createForm();
  }

  ngOnInit() {
    // Set edit mode based on whether a meter is provided
    this.isEditMode = !!this.meter;

    // Populate form only if in edit mode and meter is provided
    if (this.isEditMode && this.meter) {
      this.populateForm(this.meter);
    }

    this.loadConsumers();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      concessionaireId: ['', [Validators.required, Validators.minLength(2)]],
      meterNumber: [
        '',
        [Validators.required, Validators.minLength(2)],
        [this.meterNumberValidator()],
      ],
      installationDate: ['', [Validators.required, Validators.minLength(5)]],
      serviceAddress: ['', [Validators.required, Validators.minLength(5)]],
      status: [true],
    });
  }

  private meterNumberValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);
      return this.meterValidator.validateMeterNumber(control.value).pipe(
        map((isTaken) => (isTaken ? { meterNumberTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private populateForm(meter: MeterEntity) {
    this.meterForm.patchValue({
      concessionaireId: meter.concessionaireId,
      meterNumber: meter.meterNumber,
      installationDate: this.formatDateForInput(meter.installationDate),
      serviceAddress: meter.serviceAddress,
      status: meter.isActive(),
    });
  }

  onSubmit() {
    // Mark all fields as touched to show validation errors
    this.markFormGroupTouched();

    if (this.meterForm.valid) {
      const formData: MeterFormData = {
        concessionaireId: this.meterForm.value.concessionaireId,
        meterNumber: this.meterForm.value.meterNumber,
        installationDate: this.meterForm.value.installationDate,
        serviceAddress: this.meterForm.value.serviceAddress,
        status: this.meterForm.value.status,
      };

      console.log('Form Data to Submit:', formData); // Debug log

      this.modalCtrl.dismiss({
        submitted: true,
        formData: this.meterForm.value,
      });
    } else {
      console.log('Form invalid, validation errors:', this.meterForm.errors);
    }
  }

  onCancel() {
    // Reset form only on cancel
    this.meterForm.reset({
      concessionaireId: '',
      meterNumber: '',
      installationDate: '',
      serviceAddress: '',
      status: true,
    });
    this.formCancel.emit();
    this.modalCtrl.dismiss(); // Dismiss modal on cancel
  }

  get f() {
    return this.meterForm.controls;
  }

  private loadConsumers() {
    this.getConsumersUseCase.execute(1, 50).subscribe({
      next: (res) => {
        this.consumers = res.rows;
      },
      error: (err) => console.error('Failed to load consumers:', err),
    });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return ''; // fallback if parse fails
    return parsed.toISOString().split('T')[0]; // YYYY-MM-DD
  }

  getErrorMessage(
    fieldName: FormFieldName,
    includeFieldName: boolean = false
  ): string {
    const control = this.meterForm.get(fieldName);
    if (!control?.invalid || !control.touched) return '';

    const errors = control.errors;
    const fieldErrors = this.errorMessages[fieldName];
    const fieldLabel = this.getFieldLabel(fieldName);

    if (errors?.['required']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.required || 'This field is required'}`
        : fieldErrors?.required || 'This field is required';
    }
    if (errors?.['minlength']) {
      return includeFieldName
        ? `${fieldLabel}: ${
            fieldErrors?.minlength ||
            `Minimum length is ${errors['minlength'].requiredLength}`
          }`
        : fieldErrors?.minlength ||
            `Minimum length is ${errors['minlength'].requiredLength}`;
    }
    if (errors?.['pattern']) {
      return includeFieldName
        ? `${fieldLabel}: ${fieldErrors?.pattern || 'Invalid format'}`
        : fieldErrors?.pattern || 'Invalid format';
    }
    if (errors?.['meterNumberTaken']) {
      return includeFieldName
        ? `${fieldLabel}: ${
            fieldErrors?.meterNumberTaken || 'Meter number is already taken'
          }`
        : fieldErrors?.meterNumberTaken || 'Meter number is already taken';
    }
    if (errors?.['backendError']) {
      return includeFieldName
        ? `${fieldLabel}: ${errors['backendError']}`
        : errors['backendError'];
    }
    return includeFieldName ? `${fieldLabel}: Invalid input` : 'Invalid input';
  }

  getAllErrorMessages(): string[] {
    const errorMessages: string[] = [];
    Object.keys(this.meterForm.controls).forEach((key) => {
      const control = this.meterForm.get(key);
      if (control?.invalid && control.touched) {
        const message = this.getErrorMessage(key as FormFieldName);
        if (message)
          errorMessages.push(
            `${this.getFieldLabel(key as FormFieldName)}: ${message}`
          );
      }
    });
    return errorMessages;
  }

  private getFieldLabel(fieldName: FormFieldName): string {
    const labels: Record<FormFieldName, string> = {
      concessionaireId: 'Concessionaire',
      meterNumber: 'Meter Number',
      installationDate: 'Installation Date',
      serviceAddress: 'Service Address',
    };
    return labels[fieldName] || fieldName;
  }

  get errorMessages(): ErrorMessages {
    return {
      concessionaireId: {
        required: 'Concessionaire is required',
      },
      meterNumber: {
        required: 'Meter number is required',
        minlength: 'Last name must be at least 2 characters',
        meterNumberTaken: 'Meter number is already taken',
      },
      installationDate: {
        required: 'Installation date is required',
        minlength: 'Address must be at least 5 characters',
      },
      serviceAddress: {
        required: 'Service address is required',
        pattern: 'Phone number must be in format 09xxxxxxxxx',
      },
    };
  }

  isFormValid(): boolean {
    return this.meterForm.valid && this.meterForm.touched;
  }

  getFormErrorsCount(): number {
    let count = 0;
    Object.keys(this.meterForm.controls).forEach((key) => {
      const controlErrors = this.meterForm.get(key)?.errors;
      if (controlErrors) {
        count += Object.keys(controlErrors).length;
      }
    });
    return count;
  }

  markFormGroupTouched() {
    Object.keys(this.meterForm.controls).forEach((key) => {
      const control = this.meterForm.get(key);
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
