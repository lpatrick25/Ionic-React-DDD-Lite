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
}

interface ErrorMessages {
  consumerId: ErrorMessageConfig;
  installationDate: ErrorMessageConfig;
}

// Valid form field names
type FormFieldName =
  | 'consumerId'
  | 'installationDate';

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
      consumerId: ['', [Validators.required]],
      installationDate: ['', [Validators.required]],
    });
  }

  populateForm(meter: MeterEntity): void {
    console.log('Populating form with meter:', meter);
    this.form.patchValue({
      consumerId: meter.consumerId,
      installationDate: this.formatDateForInput(meter.installationDate),
    });
  }

  mapFormToData(): MeterFormData {
    return {
      consumerId: this.form.value.consumerId,
      installationDate: this.form.value.installationDate,
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      consumerId: 'Consumer',
      installationDate: 'Installation Date',
    };
  }

  getErrorMessages(): Record<FormFieldName, ErrorMessageConfig> {
    return {
      consumerId: {
        required: 'Consumer is required',
      },
      installationDate: {
        required: 'Installation date is required',
      },
    };
  }

  getDefaultFormValues(): any {
    return {
      consumerId: '',
      installationDate: '',
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
