import { Consumer } from "../../domain/entities/consumer.entity";

export interface ConsumerDto {
  id: number;
  account_number: string;
  meter_number: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  extension_name: string | null;
  address: string;
  street_address: string | null;
  email: string;
  phone_number: string;
  meter_type: 'Residential' | 'Commercial';
  status: 'Active' | 'Inactive';
  created_at: string;
  updated_at: string;
}

export const mapConsumerDtoToEntity = (
  dto: ConsumerDto
): Consumer => ({
  id: dto.id,
  accountNumber: dto.account_number,
  meterNumber: dto.meter_number,
  firstName: dto.first_name,
  middleName: dto.middle_name,
  lastName: dto.last_name,
  extensionName: dto.extension_name,
  address: dto.address,
  streetAddress: dto.street_address,
  email: dto.email,
  phoneNumber: dto.phone_number,
  meterType: dto.meter_type,
  status: dto.status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
});
