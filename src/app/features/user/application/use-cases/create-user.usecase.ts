import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { CreateUserDto, UserFormData } from '../dto/user.dto';
import {
  ROLES,
  STATUS,
  type Role,
  type Status,
} from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  execute(formData: UserFormData): Observable<UserEntity> {
    // Validate required fields
    if (!formData.firstName || !formData.lastName) {
      return throwError(
        () => new Error('First name and last name are required')
      );
    }

    if (!formData.phoneNumber || !formData.email || !formData.password) {
      return throwError(
        () => new Error('Phone number, email, and password are required')
      );
    }

    if (!formData.role) {
      return throwError(() => new Error('Role is required'));
    }

    if (!Object.values(ROLES).includes(formData.role)) {
      return throwError(() => new Error('Invalid role selected'));
    }

    // Transform form data to DTO
    const createDto: CreateUserDto = {
      first_name: formData.firstName,
      middle_name: formData.middleName || null,
      last_name: formData.lastName,
      extension_name: formData.extensionName || null,
      phone_number: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      role: formData.role as Role, // Type assertion since formData.role is string
      status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
    };

    // Business logic validation
    if (!this.isValidEmail(createDto.email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    if (!this.isValidPhoneNumber(createDto.phone_number)) {
      return throwError(() => new Error('Invalid phone number format'));
    }

    const user: Partial<UserEntity> & { password?: string } = {
      firstName: createDto.first_name,
      middleName: createDto.middle_name,
      lastName: createDto.last_name,
      extensionName: createDto.extension_name,
      phoneNumber: createDto.phone_number,
      email: createDto.email,
      password: createDto.password,
      role: createDto.role,
      status: createDto.status,
    };

    return this.userRepository.createUser(user);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }
}
