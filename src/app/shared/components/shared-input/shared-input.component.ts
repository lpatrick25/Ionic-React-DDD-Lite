import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IonItem, IonLabel, IonText, IonInput, IonNote } from '@ionic/angular/standalone';

@Component({
  selector: 'app-shared-input',
  templateUrl: './shared-input.component.html',
  styleUrls: ['./shared-input.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonText, IonInput, IonNote, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SharedInputComponent),
      multi: true,
    },
  ],
})
export class SharedInputComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';

  value: string = '';
  disabled: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: any) {
    this.value = event.detail.value;
    this.onChange(this.value);
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
