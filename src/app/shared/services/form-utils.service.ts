// shared/services/form-utils.service.ts
import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormUtilsService {
  markFormGroupTouched(
    formGroup: FormGroup,
    options?: { onlySelf?: boolean; emitEvent?: boolean }
  ) {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched(options);
      if (control instanceof FormGroup) {
        this.markFormGroupTouchedRecursive(control, options);
      }
    });
  }

  private markFormGroupTouchedRecursive(formGroup: FormGroup, options?: any) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control?.markAsTouched(options);
      if (control instanceof FormGroup) {
        this.markFormGroupTouchedRecursive(control, options);
      }
    });
  }

  getFormErrorsCount(formGroup: FormGroup): number {
    return Object.keys(formGroup.controls).reduce((count, key) => {
      const controlErrors = formGroup.get(key)?.errors;
      return count + (controlErrors ? Object.keys(controlErrors).length : 0);
    }, 0);
  }

  clearAsyncValidatorsForUnchangedFields(
    formGroup: FormGroup,
    fields: string[],
    originalValues: Record<string, any>
  ) {
    fields.forEach((field) => {
      const control = formGroup.get(field);
      if (!control) {
        console.warn(`Control for field "${field}" not found in form group`);
        return;
      }
      if (control.value === originalValues[field]) {
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }
}
