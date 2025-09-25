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
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private validator: UserValidator
  ) {}

  execute(formData: UserFormData): Observable<UserEntity> {
    return this.validator.validate(formData).pipe(
      switchMap(() => {
        const user: Partial<UserEntity> & { password?: string } = {
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          extensionName: formData.extensionName,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          status: formData.status ? STATUS.ACTIVE : STATUS.INACTIVE,
        };

        return this.userRepository.createUser(user);
      })
    );
  }
}
