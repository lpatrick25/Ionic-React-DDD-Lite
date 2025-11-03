import { Status } from 'src/app/core/constants/api.constants';

// API Response interfaces - Raw data from backend
export interface ConsumerApiResponse {
  id: number;
  account_number: string;
  full_name: string;
  meter_number: string;
  status: Status;
  brgy: string;
  meter_type: string;
}

export interface MeterApiResponse {
  id: number;
  consumer_id: number;
  installation_date: string;
  consumer?: ConsumerApiResponse | null;
}

export interface ApiMeterResponse {
  rows: MeterApiResponse[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    count: number;
  };
}

// Domain Meter interface - Clean model for business logic
export interface Meter {
  id?: number;
  accountNumber?: string;
  fullName: string;
  address: string;
  status: Status;
  meterNumber: string;
  installationDate: string;
  consumerId: number;

  isActive(): boolean;
}

// Domain Response interface - Transformed for business use
export interface MeterResponse {
  rows: Meter[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    count: number;
  };
}

export class MeterEntity implements Meter {
  id?: number;
  accountNumber?: string;
  fullName: string = '';
  address: string = '';
  status: Status = 'Active';
  meterNumber: string = '';
  installationDate: string = '';
  consumerId: number = 0;

  constructor(partial: Partial<Meter> = {}) {
    Object.assign(this, partial);
  }

  isActive(): boolean {
    return this.status === 'Active';
  }

  // Helper method to create from API response
  static fromApiResponse(apiMeter: MeterApiResponse): MeterEntity {
    return new MeterEntity({
      id: apiMeter.id,
      accountNumber: apiMeter.consumer?.account_number,
      fullName: apiMeter.consumer?.full_name ?? '',
      address: apiMeter.consumer?.brgy ?? '',
      status: apiMeter.consumer?.status ?? 'Inactive',
      meterNumber: apiMeter.consumer?.meter_number ?? '',
      installationDate: apiMeter.installation_date, // may need parsing if formatted
      consumerId: apiMeter.consumer_id,
    });
  }

  // Helper method to create domain response from API response
  static fromApiResponseList(apiResponse: ApiMeterResponse): MeterResponse {
    return {
      rows: apiResponse.rows.map((meter) => MeterEntity.fromApiResponse(meter)),
      pagination: {
        currentPage: apiResponse.pagination.current_page,
        lastPage: apiResponse.pagination.last_page,
        perPage: apiResponse.pagination.per_page,
        total: apiResponse.pagination.total,
        count: apiResponse.pagination.count,
      },
    };
  }
}
