// Raw API response
export interface MeterBillApiResponse {
  code: number;
  message: string;
  billing_exists: boolean;
  content: {
    meter_number: string;
    consumer_name: string;
    account_number: string;
    previous_reading: number;
  };
}

// Domain MeterBill model
export interface MeterBill {
  billingExists: boolean;
  meterNumber: string;
  consumerName: string;
  accountNumber: string;
  previousReading: number;
}

// Entity
export class MeterBillEntity implements MeterBill {
  billingExists: boolean = false;
  meterNumber: string = '';
  consumerName: string = '';
  accountNumber: string = '';
  previousReading: number = 0;

  constructor(partial: Partial<MeterBill> = {}) {
    Object.assign(this, partial);
  }

  static fromApiResponse(apiResponse: MeterBillApiResponse): MeterBillEntity {
    const { content } = apiResponse;

    return new MeterBillEntity({
      billingExists: apiResponse.billing_exists,
      meterNumber: content.meter_number,
      consumerName: content.consumer_name,
      accountNumber: content.account_number,
      previousReading: content.previous_reading,
    });
  }
}
