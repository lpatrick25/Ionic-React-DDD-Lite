import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MeterReading } from '../../domain/entities/meter-reading.entity';
import { MeterReadingDto } from '../dto/meter-reading.dto';
import { MeterReadingRepository, READING_REPOSITORY } from '../../domain/repositories/meter-reading.repository';

@Injectable()
export class MeterReadingUseCase {
  constructor(
    @Inject(READING_REPOSITORY) private meterRepository: MeterReadingRepository
  ) {}

  execute(readingDetails: MeterReadingDto): Observable<MeterReading> {
    return this.meterRepository.calculateBill(readingDetails);
  }
}
