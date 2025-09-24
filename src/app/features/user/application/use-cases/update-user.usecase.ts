import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { USER_REPOSITORY, UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserFormData } from '../dto/user.dto';
import { ROLES, STATUS } from '../../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository
  ) {}

  execute(id: number, formData: UserFormData, currentUser: UserEntity): Observable<UserEntity> {
    // Transform form data to partial user
    const updatedUser: Partial<UserEntity> & { password?: string } = {
      firstName: formData.firstName,
      middleName: formData.middleName || null,
      lastName: formData.lastName,
      extensionName: formData.extensionName || null,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      role: formData.role,
      status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE // Fix: Use STATUS.ACTIVE
    };

    // Only include password if provided (not empty)
    if (formData.password && formData.password.trim() !== '') {
      updatedUser.password = formData.password;
    }

    // Business logic validation
    if (updatedUser.email && !this.isValidEmail(updatedUser.email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    if (updatedUser.phoneNumber && !this.isValidPhoneNumber(updatedUser.phoneNumber)) {
      return throwError(() => new Error('Invalid phone number format'));
    }

    // Additional business rules
    // Example: Prevent updating own role to something without sufficient permissions
    if (currentUser.id === id && updatedUser.role && currentUser.role !== updatedUser.role) {
      // You might want to add more sophisticated permission checking here
      console.warn('User attempting to change their own role');
    }

    return this.userRepository.updateUser(id, updatedUser);
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
