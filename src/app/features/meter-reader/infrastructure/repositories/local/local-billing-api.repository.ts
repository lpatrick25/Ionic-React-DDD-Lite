import { Injectable } from '@angular/core';
import { BillingRepository } from '../../../domain/repositories/billing.repository';
import { Billing } from '../../../domain/entities/billing.entity';
import { SQLiteService } from '../../services/SQLiteService';

@Injectable({
  providedIn: 'root',
})
export class LocalBillingApiRepository implements BillingRepository {
  constructor(private sqliteService: SQLiteService) {}

  async getAll(): Promise<Billing[]> {
    const result = await this.sqliteService.executeQuery(
      'SELECT * FROM billings'
    );
    return result.values.map((row: any) => ({
      id: row.id,
      billNo: row.bill_no,
      concessionaireId: row.concessionaire_id,
      meterReadingId: row.meter_reading_id,
      billingMonth: row.billing_month,
      paymentDeadline: row.payment_deadline,
      disconnectionDate: row.disconnection_date,
      amountDue: row.amount_due,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async clear(): Promise<void> {
    await this.sqliteService.executeQuery('DELETE FROM billings');
  }

  async saveAll(billings: Billing[]): Promise<void> {
    const query = `
      INSERT INTO billings (
        id, bill_no, concessionaire_id, meter_reading_id, billing_month,
        payment_deadline, disconnection_date, amount_due, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const b of billings) {
      await this.sqliteService.executeQuery(query, [
        b.id,
        b.billNo,
        b.concessionaireId,
        b.meterReadingId,
        b.billingMonth,
        b.paymentDeadline,
        b.disconnectionDate,
        b.amountDue,
        b.status,
        b.createdAt,
        b.updatedAt,
      ]);
    }
  }
}
