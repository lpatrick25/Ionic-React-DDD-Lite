import { Role, Status } from "src/app/core/constants/api.constants";

// API Response interfaces - Raw data from backend
export interface UserApiResponse {
  id: number;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  extension_name?: string | null;
  fullname?: string;
  phone_number: string;
  email: string;
  email_verified_at?: string | null;
  role: Role;
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface ApiUserResponse {
  rows: UserApiResponse[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    count: number;
  };
}

// Domain User interface - Clean model for business logic
// Fix: Add method signatures to interface
export interface User {
  id?: number;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  extensionName?: string | null;
  phoneNumber: string;
  email: string;
  emailVerifiedAt?: string | null;
  role: Role;
  status: Status;
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;
  password?: string; // For create/update operations

  // Fix: Add method signatures to interface
  isActive(): boolean;
  hasRole(role: Role): boolean;
  isAdmin(): boolean;
  fullName: string; // Getter as property
}

// Domain Response interface - Transformed for business use
export interface UserResponse {
  rows: User[];
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    count: number;
  };
}

export class UserEntity implements User {
  id?: number;
  firstName: string = '';
  middleName?: string | null = null;
  lastName: string = '';
  extensionName?: string | null = null;
  phoneNumber: string = '';
  email: string = '';
  emailVerifiedAt?: string | null = null;
  role: Role = 'Cashier';
  status: Status = 'Active';
  createdAt?: string;
  updatedAt?: string;
  fullname?: string;
  password?: string;

  constructor(partial: Partial<User> = {}) {
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

  hasRole(role: Role): boolean {
    return this.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  // Helper method to create from API response
  static fromApiResponse(apiUser: UserApiResponse): UserEntity {
    return new UserEntity({
      id: apiUser.id,
      firstName: apiUser.first_name,
      middleName: apiUser.middle_name,
      lastName: apiUser.last_name,
      extensionName: apiUser.extension_name,
      phoneNumber: apiUser.phone_number,
      email: apiUser.email,
      emailVerifiedAt: apiUser.email_verified_at,
      role: apiUser.role,
      status: apiUser.status,
      createdAt: apiUser.created_at,
      updatedAt: apiUser.updated_at,
      fullname: apiUser.fullname
    });
  }

  // Helper method to create domain response from API response
  static fromApiResponseList(apiResponse: ApiUserResponse): UserResponse {
    return {
      rows: apiResponse.rows.map(user => UserEntity.fromApiResponse(user)),
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
