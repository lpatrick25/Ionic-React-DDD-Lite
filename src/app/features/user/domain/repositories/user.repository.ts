import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../entities/user.entity';

// Create injection token for the repository interface
export const USER_REPOSITORY = new InjectionToken<UserRepository>(
  'UserRepository'
);

export interface UserRepository {
  getUsers(page?: number, perPage?: number): Observable<UserResponse>;
  getUserById(id: number): Observable<User>;
  createUser(user: Partial<User> & { password?: string }): Observable<User>;
  updateUser(
    id: number,
    user: Partial<User> & { password?: string }
  ): Observable<User>;
  deleteUser(id: number): Observable<void>;
  searchUsers(query: string): Observable<UserResponse>;
  isEmailTaken(
    email: string,
    excludeId?: number,
    type?: 'user' | 'concessionaire'
  ): Observable<boolean>;
  isPhoneTaken(
    phoneNumber: string,
    excludeId?: number,
    type?: 'user' | 'concessionaire'
  ): Observable<boolean>;
}
