import { Status } from "src/app/core/constants/api.constants";

// API Response interfaces - Raw data from backend
export interface ConcessionaireApiResponse {
  id: number;
  account_number: string;
  full_name: string;
}

export interface MeterApiResponse {
  id: number;
  concessionaire_id: number;
  meter_number: string;
  installation_date: string;
  service_address: string;
  status: Status;
  concessionaire?: ConcessionaireApiResponse | null;
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
  serviceAddress: string;
  status: Status;
  meterNumber: string;
  installationDate: string;
  concessionaireId: number;

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
  serviceAddress: string = '';
  status: Status = 'Active';
  meterNumber: string = '';
  installationDate: string = '';
  concessionaireId: number = 0;

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
      accountNumber: apiMeter.concessionaire?.account_number,
      fullName: apiMeter.concessionaire?.full_name ?? '',
      serviceAddress: apiMeter.service_address,
      status: apiMeter.status,
      meterNumber: apiMeter.meter_number,
      installationDate: apiMeter.installation_date,
      concessionaireId: apiMeter.concessionaire_id,
    });
  }

  // Helper method to create domain response from API response
  static fromApiResponseList(apiResponse: ApiMeterResponse): MeterResponse {
    return {
      rows: apiResponse.rows.map(meter => MeterEntity.fromApiResponse(meter)),
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
