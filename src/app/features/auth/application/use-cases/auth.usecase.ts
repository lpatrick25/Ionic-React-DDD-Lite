import { Injectable, Inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthEntity } from '../../domain/entities/auth.entity';
import { AuthDto } from '../dto/auth.dto';
import { AUTH_REPOSITORY, AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthService } from 'src/app/core/services/auth.service';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private authRepository: AuthRepository,
    private authService: AuthService
  ) {}

  execute(credentials: AuthDto): Observable<AuthEntity> {
    return this.authRepository.login(credentials).pipe(
      tap((authEntity: AuthEntity) => {
        // Store token and user in AuthService
        this.authService.setAuthData(authEntity.token, {
          id: authEntity.id,
          name: authEntity.fullName,
          email: authEntity.email,
          role: authEntity.role,
        });
      })
    );
  }
}
