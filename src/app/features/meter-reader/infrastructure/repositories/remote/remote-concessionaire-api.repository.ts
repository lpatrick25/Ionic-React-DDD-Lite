import { Injectable } from '@angular/core';
import { ConcessionaireRepository } from '../../../domain/repositories/concessionaire.repository';
import { Concessionaire } from '../../../domain/entities/concessionaire.entity';
import { ApiService } from '../../services/ApiService';
import { ConcessionaireDto, mapConcessionaireDtoToEntity } from '../../../application/dto/concessionaire.dto';

@Injectable({
  providedIn: 'root',
})
export class RemoteConcessionaireRepository implements ConcessionaireRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<Concessionaire[]> {
    const dtos = await this.apiService.getConcessionaires().toPromise();
    return (dtos ?? []).map(mapConcessionaireDtoToEntity);
  }

  async saveAll(_concessionaires: Concessionaire[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
