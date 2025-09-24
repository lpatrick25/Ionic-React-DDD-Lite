// src/app/features/user/domain/value-objects/phone-number.vo.ts
export class PhoneNumber {
  private constructor(private _value: string) {
    if (!this.isValid(_value)) {
      throw new Error(`Invalid phone number format: ${_value}`);
    }
  }

  static create(value: string): PhoneNumber {
    return new PhoneNumber(value);
  }

  get value(): string {
    return this._value;
  }

  private isValid(phone: string): boolean {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  format(): string {
    const cleaned = this._value.replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
  }

  equals(other: PhoneNumber): boolean {
    return this._value === other._value;
  }
}
