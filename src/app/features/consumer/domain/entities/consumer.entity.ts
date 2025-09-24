import { Status } from "src/app/core/constants/api.constants";

// API Response interfaces - Raw data from backend
export interface ConsumerApiResponse {
  id: number;
  account_number: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  extension_name?: string | null;
  fullname?: string;
  address: string;
  phone_number: string;
  email: string;
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

// Domain Consumer interface - Clean model for business logic
export interface Consumer {
  id?: number;
  accountNumber?: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  address: string;
  phoneNumber: string;
  email: string;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;

  // Fix: Add method signatures to interface
  isActive(): boolean;
  fullName: string; // Getter as property
}

// Domain Response interface - Transformed for business use
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
  accountNumber?: string;
  firstName: string = '';
  middleName?: string | null = null;
  lastName: string = '';
  extensionName?: string | null = null;
  address: string = '';
  phoneNumber: string = '';
  email: string = '';
  emailVerifiedAt?: string | null = null;
  status: Status = 'Active';
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;

  constructor(partial: Partial<Consumer> = {}) {
    Object.assign(this, partial);
  }

  get fullName(): string {
    const parts = [this.firstName, this.middleName, this.lastName, this.extensionName]
      .filter(part => part && part.trim() !== '');

    return parts.join(' ');
  }

  isActive(): boolean {
    return this.status === 'Active';
  }

  // Helper method to create from API response
  static fromApiResponse(apiConsumer: ConsumerApiResponse): ConsumerEntity {
    return new ConsumerEntity({
      id: apiConsumer.id,
      accountNumber: apiConsumer.account_number,
      firstName: apiConsumer.first_name,
      middleName: apiConsumer.middle_name,
      lastName: apiConsumer.last_name,
      extensionName: apiConsumer.extension_name,
      address: apiConsumer.address,
      phoneNumber: apiConsumer.phone_number,
      email: apiConsumer.email,
      status: apiConsumer.status,
      createdAt: apiConsumer.created_at,
      updatedAt: apiConsumer.updated_at,
      fullname: apiConsumer.fullname
    });
  }

  // Helper method to create domain response from API response
  static fromApiResponseList(apiResponse: ApiConsumerResponse): ConsumerResponse {
    return {
      rows: apiResponse.rows.map(consumer => ConsumerEntity.fromApiResponse(consumer)),
      pagination: {
        currentPage: apiResponse.pagination.current_page,
        lastPage: apiResponse.pagination.last_page,
        perPage: apiResponse.pagination.per_page,
        total: apiResponse.pagination.total,
        count: apiResponse.pagination.count
      }
    };
  }
}
