import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserFormData } from '../dto/user.dto';
import { STATUS } from '../../../../core/constants/api.constants';
import { UserValidator } from '../services/user-validator.service';

@Injectable({
  providedIn: 'root',
})
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private validator: UserValidator
  ) {}

  execute(
    id: number,
    formData: UserFormData,
    currentUser: UserEntity
  ): Observable<UserEntity> {
    return this.validator.validate(formData, id).pipe(
      switchMap(() => {
        const updatedUser: Partial<UserEntity> & { password?: string } = {
          firstName: formData.firstName,
          middleName: formData.middleName || null,
          lastName: formData.lastName,
          extensionName: formData.extensionName || null,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          role: formData.role,
          status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
        };

        // Only include password if provided
        if (formData.password?.trim()) {
          updatedUser.password = formData.password;
        }

        // (Optional) business rules like self-role updates can stay here
        if (
          currentUser.id === id &&
          updatedUser.role &&
          currentUser.role !== updatedUser.role
        ) {
          console.warn('User attempting to change their own role');
        }

        return this.userRepository.updateUser(id, updatedUser);
      })
    );
  }
}
