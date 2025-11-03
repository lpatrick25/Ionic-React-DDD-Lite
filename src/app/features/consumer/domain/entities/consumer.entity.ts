import { MeterType, Status } from 'src/app/core/constants/api.constants';

// API Response interfaces
export interface ConsumerApiResponse {
  id: number;
  account_number: string;
  meter_number: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  extension_name?: string | null;
  fullname?: string;
  brgy: string;
  street_address?: string | null;
  phone_number: string;
  email: string;
  meter_type: MeterType;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface ApiConsumerResponse {
  rows: ConsumerApiResponse[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    count: number;
  };
}

// Domain Consumer interface
export interface Consumer {
  id?: number;
  accountNumber: string;
  meterNumber: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  address: string;
  streetAddress?: string | null;
  phoneNumber: string;
  email: string;
  meterType: MeterType;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;

  isActive(): boolean;
  fullName: string; // Getter as property
}

// Domain Response interface
export interface ConsumerResponse {
  rows: Consumer[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    count: number;
  };
}

export class ConsumerEntity implements Consumer {
  id?: number;
  accountNumber: string = '';
  meterNumber: string = '';
  firstName: string = '';
  middleName?: string | null = null;
  lastName: string = '';
  extensionName?: string | null = null;
  address: string = '';
  streetAddress?: string | null = null;
  phoneNumber: string = '';
  email: string = '';
  meterType: MeterType = MeterType.Residential;
  emailVerifiedAt?: string | null = null;
  status: Status = 'Active';
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;

  constructor(partial: Partial<Consumer> = {}) {
    Object.assign(this, partial);
  }

  get fullName(): string {
    const parts = [
      this.firstName,
      this.middleName,
      this.lastName,
      this.extensionName,
    ].filter((part) => part && part.trim() !== '');
    return parts.join(' ');
  }

  isActive(): boolean {
    return this.status === 'Active';
  }

  static fromApiResponse(apiConsumer: ConsumerApiResponse): ConsumerEntity {
    return new ConsumerEntity({
      id: apiConsumer.id,
      accountNumber: apiConsumer.account_number,
      meterNumber: apiConsumer.meter_number,
      firstName: apiConsumer.first_name,
      middleName: apiConsumer.middle_name,
      lastName: apiConsumer.last_name,
      extensionName: apiConsumer.extension_name,
      address: apiConsumer.brgy,
      streetAddress: apiConsumer.street_address,
      phoneNumber: apiConsumer.phone_number,
      email: apiConsumer.email,
      meterType: apiConsumer.meter_type,
      status: apiConsumer.status,
      createdAt: apiConsumer.created_at,
      updatedAt: apiConsumer.updated_at,
      fullname: apiConsumer.fullname,
    });
  }

  static fromApiResponseList(
    apiResponse: ApiConsumerResponse
  ): ConsumerResponse {
    return {
      rows: apiResponse.rows.map((consumer) =>
        ConsumerEntity.fromApiResponse(consumer)
      ),
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
