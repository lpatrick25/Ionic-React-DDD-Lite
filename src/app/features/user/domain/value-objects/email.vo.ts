export class Email {
  // Rename private property to avoid conflict with getter
  private constructor(private _value: string) {
    if (!this.isValid(_value)) {
      throw new Error(`Invalid email format: ${_value}`);
    }
  }

  static create(value: string): Email {
    return new Email(value);
  }

  // Getter remains as 'value' to maintain public API
  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
