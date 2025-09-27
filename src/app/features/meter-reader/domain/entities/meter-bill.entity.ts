// Raw API response
export interface MeterBillApiResponse {
  code: number;
  message: string;
  content: {
    meter_number: string;
    concessionaire_name: string;
    account_number: string;
    previous_reading: number;
  };
}

// Domain MeterBill model
export interface MeterBill {
  meterNumber: string;
  concessionaireName: string;
  accountNumber: string;
  previousReading: number;
}

// Entity
export class MeterBillEntity implements MeterBill {
  meterNumber: string = '';
  concessionaireName: string = '';
  accountNumber: string = '';
  previousReading: number = 0;

  constructor(partial: Partial<MeterBill> = {}) {
    Object.assign(this, partial);
  }

  static fromApiResponse(apiResponse: MeterBillApiResponse): MeterBillEntity {
    const { content } = apiResponse;

    return new MeterBillEntity({
      meterNumber: content.meter_number,
      concessionaireName: content.concessionaire_name,
      accountNumber: content.account_number,
      previousReading: content.previous_reading,
    });
  }
}
