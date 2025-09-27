import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ModalController,
  IonicModule,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { AbstractFormComponent } from '../../../../../shared/components/form/abstract-form.component';
import { MeterReadingDto } from '../../../application/dto/meter-reading.dto';
import { MeterBillEntity } from '../../../domain/entities/meter-bill.entity';
import { CommonModule } from '@angular/common';
import { finalize, Observable } from 'rxjs';
import { MeterReadingEntity } from '../../../domain/entities/meter-reading.entity';
import { MeterReadingUseCase } from '../../../application/use-cases/meter-reading.usecase';

// Define error message structure
interface ErrorMessageConfig {
  required?: string;
  min?: string;
  mustBeGreater?: string;
}

// Valid form field names
type FormFieldName = 'currentReading';

// Define type for backend validation errors
interface ValidationErrors {
  [key: string]: string[];
}

@Component({
  selector: 'app-meter-reading-form',
  templateUrl: './meter-reading-form.component.html',
  styleUrls: ['./meter-reading-form.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class MeterReadingFormComponent
  extends AbstractFormComponent<MeterReadingDto, MeterBillEntity>
  implements OnInit
{
  @Input()
  set meter(meter: MeterBillEntity | null | undefined) {
    console.log('Meter input set:', meter);
    this.entity = meter;
    if (this.form && meter) {
      console.log('Calling populateForm from meter setter');
      this.populateForm(meter);
    }
  }

  successMessage: string | null = null;
  errorMessage: string | null = null;
  meterReading: MeterReadingEntity | null = null;

  constructor(
    fb: FormBuilder,
    modalCtrl: ModalController,
    private loadingController: LoadingController,
    private readingUseCase: MeterReadingUseCase,
    private toastController: ToastController
  ) {
    super(fb, modalCtrl);
  }

  override ngOnInit() {
    console.log('MeterReadingFormComponent ngOnInit', {
      entity: this.entity,
    });
    super.ngOnInit();
  }

  createForm(): FormGroup {
    return this.fb.group({
      currentReading: [
        '',
        [
          Validators.required,
          Validators.min(0),
          this.currentReadingGreaterThanPreviousValidator.bind(this),
        ],
      ],
    });
  }

  /** Custom Validator */
  private currentReadingGreaterThanPreviousValidator(control: any) {
    if (this.entity && control.value !== null && control.value !== '') {
      const current = Number(control.value);
      const previous = Number(this.entity.previousReading ?? 0);
      if (current <= previous) {
        return { mustBeGreater: true };
      }
    }
    return null;
  }

  populateForm(meter: MeterBillEntity): void {
    this.form.patchValue(this.getDefaultFormValues());
  }

  mapFormToData(): MeterReadingDto {
    return {
      previousReading: this.entity?.previousReading || 0,
      currentReading: Number(this.form.value.currentReading),
      readingDate: new Date().toISOString().split('T')[0],
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      currentReading: 'Current Reading',
    };
  }

  getErrorMessages(): Record<FormFieldName, ErrorMessageConfig> {
    return {
      currentReading: {
        required: 'Current reading is required',
        min: 'Current reading cannot be negative',
        mustBeGreater: 'Current reading must be greater than previous reading',
      },
    };
  }

  getDefaultFormValues(): any {
    return {
      currentReading: '',
    };
  }

  async calculateBill() {
    if (this.form.valid) {
      const payload: MeterReadingDto = {
        previousReading: this.entity?.previousReading ?? 0,
        currentReading: Number(this.form.value.currentReading),
        readingDate: new Date().toISOString().split('T')[0],
      };

      console.log('Meter Reading Form Data:', payload);

      this.isLoading = true;

      const loading = await this.loadingController.create({
        message: 'Calculating Bill',
      });
      await loading.present();

      let request$: Observable<MeterReadingEntity> =
        this.readingUseCase.execute(payload);

      request$
        .pipe(
          finalize(async () => {
            this.isLoading = false;
            await loading.dismiss();
          })
        )
        .subscribe({
          next: (reading: MeterReadingEntity) => {
            console.log('Bill calculated:', reading);
            this.meterReading = reading;
            this.showSuccessMessage('Amount due calculated successfully.');
          },
          error: (error) => {
            console.error('Error saving user:', error);
            const errorMessage = error.message || `Failed to calculate bill`;
            const validationErrors = error.error?.errors as
              | ValidationErrors
              | undefined;

            let detailedMessage = errorMessage;
            if (validationErrors && Object.keys(validationErrors).length > 0) {
              detailedMessage +=
                ': ' +
                Object.entries(validationErrors)
                  .map(
                    ([field, messages]) => `${field}: ${messages.join(', ')}`
                  )
                  .join('; ');
            }

            this.showErrorMessage(detailedMessage);
          },
        });
    } else {
      console.warn('Meter Reading Form invalid:', this.form.errors);
    }
  }

  async printReceipt() {
    if (!this.entity && !this.meterReading) {
      await this.showErrorMessage('No bill data available to print');
      return;
    }

    const formData = {
      accountNumber: this.entity?.accountNumber,
      concessionaireName: this.entity?.concessionaireName,
      meterNumber: this.entity?.meterNumber,
      previousReading: this.entity?.previousReading,
      currentReading: Number(this.form.value.currentReading),
      consumption: this.meterReading?.consumption,
      amountDue: this.meterReading?.amountDue,
    };

    this.isLoading = true;
    try {
      console.log('Printing receipt:', formData);
      await this.showSuccessMessage('Receipt printed successfully');
      await this.modalCtrl.dismiss({
        submitted: true,
        formData,
        meterReading: this.meterReading,
      });
    } catch (error) {
      console.error('Error printing receipt:', error);
      await this.showErrorMessage('Failed to print receipt');
    } finally {
      this.isLoading = false;
    }
  }

  private async showSuccessMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();
  }

  private async showErrorMessage(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      color: 'danger',
      position: 'bottom',
      buttons: [{ text: 'Close', role: 'cancel' }],
    });
    await toast.present();
  }
}
