import { AbstractControl, ValidationErrors } from '@angular/forms';

export class FormUtils {
  static markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  static getErrorMessage(control: AbstractControl, customMessages?: { [key: string]: string }): string {
    const errors = control.errors;
    if (!errors) return '';

    if (errors['required']) {
      return customMessages?.['required'] || 'This field is required';
    }

    if (errors['email']) {
      return customMessages?.['email'] || 'Please enter a valid email address';
    }

    if (errors['minlength']) {
      return customMessages?.['minlength'] || `Minimum length is ${errors['minlength'].requiredLength}`;
    }

    if (errors['pattern']) {
      return customMessages?.['pattern'] || 'Invalid format';
    }

    return 'Invalid input';
  }

  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('09') && cleaned.length === 11) {
      return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }
    return phone;
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }
}
