import { Status } from "src/app/core/constants/api.constants";

export interface CreateMeterDto {
  concessionaire_id: number;
  installation_date: string;
}

export interface UpdateMeterDto {
  concessionaire_id?: number;
  installation_date?: string;
}

export interface MeterFormData {
  concessionaireId: number;
  installationDate: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}
