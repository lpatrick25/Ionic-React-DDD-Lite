export interface Concessionaire {
  id: number;
  accountNumber: string;
  meterNumber: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  extensionName: string | null;
  address: string;
  streetAddress: string | null;
  email: string;
  phoneNumber: string;
  meterType: 'Residential' | 'Commercial';
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
