import { Billing } from "../../domain/entities/billing.entity";

export interface BillingDto {
  id: number;
  bill_no: string;
  consumer_id: number;
  meter_reading_id: number;
  billing_month: string;
  payment_deadline: string;
  disconnection_date: string;
  amount_due: string;
  status: 'Pending' | 'Paid' | 'Overdue';
  created_at: string;
  updated_at: string;
}

export const mapBillingDtoToEntity = (dto: BillingDto): Billing => ({
  id: dto.id,
  billNo: dto.bill_no,
  consumerId: dto.consumer_id,
  meterReadingId: dto.meter_reading_id,
  billingMonth: dto.billing_month,
  paymentDeadline: dto.payment_deadline,
  disconnectionDate: dto.disconnection_date,
  amountDue: parseFloat(dto.amount_due),
  status: dto.status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
