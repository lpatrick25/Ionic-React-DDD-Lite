import { Observable } from 'rxjs';
import { AuthEntity } from '../entities/auth.entity';
import { InjectionToken } from '@angular/core';

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>('AuthRepository');

export interface AuthRepository {
  login(credentials: { email: string; password: string }): Observable<AuthEntity>;
}
