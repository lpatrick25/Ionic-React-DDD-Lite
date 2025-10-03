export interface TariffRate {
  id: number;
  effectiveDate: string;
  minConsumption: number;
  maxConsumption: number | null;
  flatAmount: number;
  ratePerCubicMeter: number;
  createdAt: string;
  updatedAt: string;
}
