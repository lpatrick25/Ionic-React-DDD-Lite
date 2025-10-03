import { Meter } from "../../domain/entities/meter.entity";

export interface MeterDto {
  id: number;
  concessionaire_id: number;
  installation_date: string;
  created_at: string;
  updated_at: string;
}

export const mapMeterDtoToEntity = (dto: MeterDto): Meter => ({
  id: dto.id,
  concessionaireId: dto.concessionaire_id,
  installationDate: dto.installation_date,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
