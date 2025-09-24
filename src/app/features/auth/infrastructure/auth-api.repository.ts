import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { AuthRepository } from '../domain/repositories/auth.repository';
import { LoginDto } from '../application/dto/auth.dto';
import { AuthEntity, AuthApiResponse } from '../domain/entities/auth.entity';

@Injectable({
  providedIn: 'root',
})
export class AuthApiRepository implements AuthRepository {
  private readonly endpoint = API_ENDPOINTS.LOGIN;

  constructor(private apiService: ApiService) {}

  login(credentials: LoginDto): Observable<AuthEntity> {
    return this.apiService
      .post<AuthApiResponse>(this.endpoint, credentials)
      .pipe(
        map((apiResponse: AuthApiResponse) => {
          console.log('Raw login response:', apiResponse);
          return AuthEntity.fromApiResponse(apiResponse);
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(() => ({
            message: error.error?.message || 'Login failed',
            errors: error.error?.errors || {},
          }));
        })
      );
  }
}
