import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  execute(userId: number): Observable<void> {
    return this.userRepository.deleteUser(userId);
  }
}
