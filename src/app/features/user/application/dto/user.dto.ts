import { Role, Status } from "src/app/core/constants/api.constants";

export interface CreateUserDto {
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  extension_name?: string | null;
  phone_number: string;
  email: string;
  password: string;
  role: Role;
  status?: Status;
}

export interface UpdateUserDto {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  extension_name?: string | null;
  phone_number?: string;
  email?: string;
  password?: string;
  role?: Role;
  status?: Status;
}

// Form data interface - uses boolean for status toggle
export interface UserFormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  extensionName?: string;
  phoneNumber: string;
  email: string;
  password?: string;
  role: Role;
  status: boolean; // Boolean for form toggle, converted to Status in use case
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
