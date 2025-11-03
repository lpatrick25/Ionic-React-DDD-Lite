import { Status } from "src/app/core/constants/api.constants";

export interface CreateMeterDto {
  consumer_id: number;
  installation_date: string;
}

export interface UpdateMeterDto {
  consumer_id?: number;
  installation_date?: string;
}

export interface MeterFormData {
  consumerId: number;
  installationDate: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
