import { Meter } from "../../domain/entities/meter.entity";

export interface MeterDto {
  id: number;
  consumer_id: number;
  installation_date: string;
  created_at: string;
  updated_at: string;
}

export const mapMeterDtoToEntity = (dto: MeterDto): Meter => ({
  id: dto.id,
  consumerId: dto.consumer_id,
  installationDate: dto.installation_date,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
