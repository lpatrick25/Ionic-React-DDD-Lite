import { MeterReadings } from "../../domain/entities/meter-reading.entity";

export interface MeterReadingDto {
  previousReading: number;
  currentReading: number;
  readingDate: string;
}

export interface MeterReadingsDto {
  id: number;
  meter_id: number;
  reader_id: number | null;
  reading_date: string;
  previous_reading: number;
  present_reading: number;
  consumption: number;
  created_at: string;
  updated_at: string;
}

export const mapMeterReadingsDtoToEntity = (dto: MeterReadingsDto): MeterReadings => ({
  id: dto.id,
  meterId: dto.meter_id,
  readerId: dto.reader_id,
  readingDate: dto.reading_date,
  previousReading: dto.previous_reading,
  presentReading: dto.present_reading,
  consumption: dto.consumption,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
