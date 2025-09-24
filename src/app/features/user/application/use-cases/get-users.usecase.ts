import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { UserResponse } from '../../domain/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  execute(page: number = 1, perPage: number = 10): Observable<UserResponse> {
    // Business logic can be added here (e.g., role-based filtering)
    // For example, filter users based on current user's role
    return this.userRepository.getUsers(page, perPage);
  }

  // Additional method for admin-only operations
  getAllUsersAdminOnly(): Observable<UserResponse> {
    return this.userRepository.getUsers(1, 1000); // Get all users for admin
  }
}
