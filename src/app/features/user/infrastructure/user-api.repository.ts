import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { API_ENDPOINTS } from '../../../core/constants/api.constants';
import { UserRepository } from '../domain/repositories/user.repository';
import {
  UserResponse,
  ApiUserResponse,
  UserApiResponse,
  UserEntity,
} from '../domain/entities/user.entity';
import { CreateUserDto, UpdateUserDto } from '../application/dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserApiRepository implements UserRepository {
  private readonly endpoint = API_ENDPOINTS.USERS;

  constructor(private apiService: ApiService) {}

  getUsers(page: number = 1, perPage: number = 10): Observable<UserResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    // Fix: Get raw API response and transform it to domain model
    return this.apiService
      .get<ApiUserResponse>(this.endpoint, params)
      .pipe(
        map((apiResponse: ApiUserResponse) =>
          UserEntity.fromApiResponseList(apiResponse)
        )
      );
  }

  getUserById(id: number): Observable<UserEntity> {
    return this.apiService
      .get<UserApiResponse>(`${this.endpoint}/${id}`)
      .pipe(
        map((apiUser: UserApiResponse) => UserEntity.fromApiResponse(apiUser))
      );
  }

  createUser(
    userData: Partial<UserEntity> & { password?: string }
  ): Observable<UserEntity> {
    const createDto: CreateUserDto = {
      first_name: userData.firstName!,
      middle_name: userData.middleName,
      last_name: userData.lastName!,
      extension_name: userData.extensionName,
      phone_number: userData.phoneNumber!,
      email: userData.email!,
      password: userData.password!, // Password is required for creation
      role: userData.role!,
    };

    return this.apiService
      .post<UserApiResponse>(this.endpoint, createDto)
      .pipe(
        map((apiUser: UserApiResponse) => UserEntity.fromApiResponse(apiUser))
      );
  }

  updateUser(
    id: number,
    userData: Partial<UserEntity> & { password?: string }
  ): Observable<UserEntity> {
    const updateDto: UpdateUserDto = {
      first_name: userData.firstName,
      middle_name: userData.middleName,
      last_name: userData.lastName,
      extension_name: userData.extensionName,
      phone_number: userData.phoneNumber,
      email: userData.email,
      role: userData.role,
      status: userData.status,
    };

    // Include password only if provided
    if (userData.password) {
      (updateDto as any).password = userData.password;
    }

    return this.apiService
      .put<UserApiResponse>(`${this.endpoint}/${id}`, updateDto)
      .pipe(
        map((apiUser: UserApiResponse) => UserEntity.fromApiResponse(apiUser))
      );
  }

  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  searchUsers(query: string): Observable<UserResponse> {
    const params = new HttpParams().set('search', query);

    // Fix: Get raw API response and transform it to domain model
    return this.apiService
      .get<ApiUserResponse>(this.endpoint, params)
      .pipe(
        map((apiResponse: ApiUserResponse) =>
          UserEntity.fromApiResponseList(apiResponse)
        )
      );
  }

  // Keep the original mapping method for reference (optional)
  private mapApiToEntity(apiUser: UserApiResponse): UserEntity {
    return UserEntity.fromApiResponse(apiUser);
  }
}
