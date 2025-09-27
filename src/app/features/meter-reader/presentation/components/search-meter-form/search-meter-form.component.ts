import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { MeterBillDto } from '../../../application/dto/meter-bill.dto';
import { AbstractFormComponent } from '../../../../../shared/components/form/abstract-form.component';

// Error message type for better typing
interface ErrorMessageConfig {
  required?: string;
  minlength?: string;
}

interface ErrorMessages {
  meterNumber: ErrorMessageConfig;
}

type FormFieldName = 'meterNumber';

@Component({
  selector: 'app-search-meter-form',
  templateUrl: './search-meter-form.component.html',
  styleUrls: ['./search-meter-form.component.scss'],
  standalone: false,
})
export class SearchMeterFormComponent
  extends AbstractFormComponent<MeterBillDto, never>
  implements OnInit, OnChanges
{
  constructor(fb: FormBuilder, modalCtrl: ModalController) {
    super(fb, modalCtrl);
  }

  override ngOnInit() {
    console.log('SearchMeterForm ngOnInit');
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('SearchMeterForm ngOnChanges', changes);
  }

  createForm(): FormGroup {
    console.log('Creating search meter form');
    return this.fb.group({
      meterNumber: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  override onSubmit() {
    this.markFormGroupTouched();
    this.submitted = true;

    if (this.form.valid) {
      const formData: MeterBillDto = this.form.value;
      console.log('Search Meter Form Data:', formData);

      this.formSubmit.emit({ submitted: true, formData });
      this.modalCtrl.dismiss({ submitted: true, formData });
    } else {
      console.warn('Search Meter Form invalid:', this.form.errors);
    }
  }

  populateForm(_entity: never): void {
    console.log('populateForm called (no-op for SearchMeterForm)');
  }

  mapFormToData(): MeterBillDto {
    return {
      meterNumber: this.form.value.meterNumber,
    };
  }

  getFieldLabels(): Record<FormFieldName, string> {
    return {
      meterNumber: 'meterNumber',
    };
  }

  getErrorMessages(): Record<FormFieldName, ErrorMessageConfig> {
    return {
      meterNumber: {
        required: 'Meter number is required',
        minlength: 'Meter number must be at least 6 characters',
      },
    };
  }

  getDefaultFormValues(): any {
    return {
      meterNumber: '',
    };
  }
}
