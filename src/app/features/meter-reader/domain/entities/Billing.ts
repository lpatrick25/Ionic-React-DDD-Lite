export interface Billing {
  id: number;
  billNo: string;
  concessionaireId: number;
  meterReadingId: number;
  billingMonth: string;
  paymentDeadline: string;
  disconnectionDate: string;
  amountDue: number;
  status: 'Pending' | 'Paid' | 'Overdue';
  createdAt: string;
  updatedAt: string;
}
