import { Status } from "src/app/core/constants/api.constants";

export interface CreateConsumerDto {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  extension_name?: string | null;
  address: string;
  phone_number: string;
  email: string;
  status?: Status;
}

export interface UpdateConsumerDto {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  extension_name?: string | null;
  phone_number?: string;
  email?: string;
  address?: string;
  status?: Status;
}

export interface ConsumerFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  phoneNumber: string;
  email: string;
  address?: string;
  status: boolean;
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
