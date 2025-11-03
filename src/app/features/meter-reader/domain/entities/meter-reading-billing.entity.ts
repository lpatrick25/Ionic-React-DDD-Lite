export class MeterReadingBillingEntity {
  constructor(
    public id: number,
    public meterId: number,
    public readerId: number | null,
    public readingDate: string,
    public previousReading: number,
    public presentReading: number,
    public consumption: number
  ) {}
}
