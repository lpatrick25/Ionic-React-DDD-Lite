import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ADDRESSES } from '../../../../../core/constants/api.constants';
import { MeterEntity } from '../../../domain/entities/meter.entity';
import { MeterFormData } from '../../../application/dto/meter.dto';
import { GetConsumersUseCase } from '../../../../consumer/application/use-cases/get-consumers.usecase';
import { Consumer } from '../../../../consumer/domain/entities/consumer.entity';
import { MeterValidator } from '../../../application/services/meter-validator.service';
import { AsyncValidatorService } from '../../../../../shared/services/async-validator.service';
import { AbstractFormComponent } from '../../../../../shared/components/form/abstract-form.component';

// Address type from constants
export type Address = (typeof ADDRESSES)[keyof typeof ADDRESSES];

// Define error message structure
interface ErrorMessageConfig {
  required?: string;
  minlength?: string;
  meterNumberTaken?: string;
}

interface ErrorMessages {
  concessionaireId: ErrorMessageConfig;
  meterNumber: ErrorMessageConfig;
  installationDate: ErrorMessageConfig;
  serviceAddress: ErrorMessageConfig;
}

// Valid form field names
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
export class MeterFormComponent
  extends AbstractFormComponent<MeterFormData, MeterEntity>
  implements OnInit
{
  addresses = Object.values(ADDRESSES);
  consumers: Consumer[] = [];

  @Input()
  set meter(meter: MeterEntity | null | undefined) {
    console.log('Meter input set:', meter);
    this.entity = meter;
    if (this.form && meter) {
      console.log('Calling populateForm from meter setter');
      this.populateForm(meter);
    }
  }

  constructor(
    fb: FormBuilder,
    modalCtrl: ModalController,
    private getConsumersUseCase: GetConsumersUseCase,
    private meterValidator: MeterValidator,
    private asyncValidatorService: AsyncValidatorService
  ) {
    super(fb, modalCtrl);
  }

  override ngOnInit() {
    console.log('MeterFormComponent ngOnInit', { entity: this.entity });
    super.ngOnInit();
    this.loadConsumers();
  }

  createForm(): FormGroup {
    console.log('Creating form with entity ID:', this.entity?.id);
    return this.fb.group({
      concessionaireId: ['', [Validators.required]],
      meterNumber: [
        '',
        [Validators.required, Validators.minLength(2)],
        [
          this.asyncValidatorService.createMeterNumberValidator(
            (meterNumber, excludeId) =>
              this.meterValidator.validateMeterNumber(meterNumber, excludeId),
            this.entity?.id ? Number(this.entity.id) : null
          ),
        ],
      ],
      installationDate: ['', [Validators.required]],
      serviceAddress: ['', [Validators.required]],
      status: [true],
    });
  }

  populateForm(meter: MeterEntity): void {
    console.log('Populating form with meter:', meter);
    this.form.patchValue({
      concessionaireId: meter.concessionaireId,
      meterNumber: meter.meterNumber,
      installationDate: this.formatDateForInput(meter.installationDate),
      serviceAddress: meter.serviceAddress,
      status: meter.isActive(),
    });
  }

  mapFormToData(): MeterFormData {
    return {
      concessionaireId: this.form.value.concessionaireId,
      meterNumber: this.form.value.meterNumber,
      installationDate: this.form.value.installationDate,
      serviceAddress: this.form.value.serviceAddress,
      status: this.form.value.status,
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      concessionaireId: 'Concessionaire',
      meterNumber: 'Meter Number',
      installationDate: 'Installation Date',
      serviceAddress: 'Service Address',
    };
  }

  getErrorMessages(): Record<FormFieldName, ErrorMessageConfig> {
    return {
      concessionaireId: {
        required: 'Concessionaire is required',
      },
      meterNumber: {
        required: 'Meter number is required',
        minlength: 'Meter number must be at least 2 characters',
        meterNumberTaken: 'Meter number is already taken',
      },
      installationDate: {
        required: 'Installation date is required',
      },
      serviceAddress: {
        required: 'Service address is required',
      },
    };
  }

  getDefaultFormValues(): any {
    return {
      concessionaireId: '',
      meterNumber: '',
      installationDate: '',
      serviceAddress: '',
      status: true,
    };
  }

  private loadConsumers() {
    this.getConsumersUseCase.execute(1, 50).subscribe({
      next: (res) => {
        this.consumers = res.rows;
        console.log('Consumers loaded:', this.consumers);
      },
      error: (err) => console.error('Failed to load consumers:', err),
    });
  }

  private formatDateForInput(dateString: string): string {
    if (!dateString) return '';
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) return ''; // Fallback if parse fails
    return parsed.toISOString().split('T')[0]; // YYYY-MM-DD
  }
}
