import { MeterType, Status } from 'src/app/core/constants/api.constants';

export interface CreateConsumerDto {
  meter_number: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  extension_name?: string | null;
  address: string;
  street_address?: string | null;
  phone_number: string;
  email: string;
  meter_type: MeterType;
  status?: Status;
}

export interface UpdateConsumerDto {
  meter_number?: string;
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  extension_name?: string | null;
  phone_number?: string;
  email?: string;
  address?: string;
  street_address?: string | null;
  meter_type?: MeterType;
  status?: Status;
}

export interface ConsumerFormData {
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
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
