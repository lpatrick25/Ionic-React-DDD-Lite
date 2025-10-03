import { Injectable } from '@angular/core';
import { UserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';
import { ApiService } from '../../services/ApiService';
import { UserDto, mapUserDtoToEntity } from '../../../application/dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class RemoteUserRepository implements UserRepository {
  constructor(private apiService: ApiService) {}

  async getAll(): Promise<User[]> {
    const dtos = await this.apiService.getUsers().toPromise();
    return (dtos ?? []).map(mapUserDtoToEntity);
  }

  async saveAll(_users: User[]): Promise<void> {
    throw new Error('Save not supported for remote repository');
  }

  async clear(): Promise<void> {}
}
