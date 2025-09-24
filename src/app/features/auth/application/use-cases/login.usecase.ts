import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { LoginDto } from '../dto/auth.dto';
import { AUTH_REPOSITORY, AuthRepository } from '../../domain/repositories/auth.repository';

@Injectable()
export class LoginUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private authRepository: AuthRepository) {}

  execute(credentials: LoginDto): Observable<AuthEntity> {
    return this.authRepository.login(credentials);
  }
}
