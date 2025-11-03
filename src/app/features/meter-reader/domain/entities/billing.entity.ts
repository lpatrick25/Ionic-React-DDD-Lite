export interface Billing {
  id: number;
  billNo: string;
  consumerId: number;
  meterReadingId: number;
  billingMonth: string;
  paymentDeadline: string;
  disconnectionDate: string;
  amountDue: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  createdAt: string;
  updatedAt: string;
}

export class BillingEntity {
  constructor(
    public id: number,
    public billNo: string,
    public consumerId: number,
    public meterReadingId: number,
    public billingMonth: string,
    public paymentDeadline: string,
    public disconnectionDate: string,
    public amountDue: number,
    public status: 'Pending' | 'Paid' | 'Overdue'
  ) {}
}
