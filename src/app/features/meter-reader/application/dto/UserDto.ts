import { User } from "../../domain/entities/User";

export interface UserDto {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  extension_name: string | null;
  phone_number: string;
  email: string;
  email_verified_at: string | null;
  role: 'Admin' | 'Meter Reader' | 'Cashier' | 'Head';
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export const mapUserDtoToEntity = (dto: UserDto): User => ({
  id: dto.id,
  firstName: dto.first_name,
  middleName: dto.middle_name,
  lastName: dto.last_name,
  extensionName: dto.extension_name,
  phoneNumber: dto.phone_number,
  email: dto.email,
  emailVerifiedAt: dto.email_verified_at,
  role: dto.role,
  status: dto.status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
