import { Status } from "src/app/core/constants/api.constants";

export interface CreateMeterDto {
  concessionaire_id: number;
  meter_number: string;
  installation_date: string;
  service_address: string;
  status?: Status;
}

export interface UpdateMeterDto {
  concessionaire_id?: number;
  meter_number?: string;
  installation_date?: string;
  service_address?: string;
  status?: Status;
}

export interface MeterFormData {
  concessionaireId: number;
  meterNumber: string;
  installationDate: string;
  serviceAddress: string;
  status: boolean;
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
