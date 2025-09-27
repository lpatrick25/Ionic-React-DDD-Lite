// Raw API response
export interface MeterReadingApiResponse {
  code: number;
  message: string;
  content: {
    consumption: number;
    amount_due: number;
  };
}

// Domain MeterReading model
export interface MeterReading {
  consumption: number;
  amountDue: number;
}

// Entity
export class MeterReadingEntity implements MeterReading {
  consumption: number = 0;
  amountDue: number = 0;

  constructor(partial: Partial<MeterReading> = {}) {
    Object.assign(this, partial);
  }

  static fromApiResponse(apiResponse: MeterReadingApiResponse): MeterReadingEntity {
    const { content } = apiResponse;

    return new MeterReadingEntity({
      consumption: content.consumption,
      amountDue: content.amount_due,
    });
  }
}
