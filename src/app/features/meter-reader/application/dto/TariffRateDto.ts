import { TariffRate } from "../../domain/entities/TariffRate";

export interface TariffRateDto {
  id: number;
  effective_date: string;
  min_consumption: number;
  max_consumption: number | null;
  flat_amount: string;
  rate_per_cubic_meter: string;
  created_at: string;
  updated_at: string;
}

export const mapTariffRateDtoToEntity = (dto: TariffRateDto): TariffRate => ({
  id: dto.id,
  effectiveDate: dto.effective_date,
  minConsumption: dto.min_consumption,
  maxConsumption: dto.max_consumption,
  flatAmount: parseFloat(dto.flat_amount),
  ratePerCubicMeter: parseFloat(dto.rate_per_cubic_meter),
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
