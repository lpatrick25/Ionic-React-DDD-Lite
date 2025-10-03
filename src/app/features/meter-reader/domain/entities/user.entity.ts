export interface User {
  id: number;
  firstName: string;
  middleName: string | null;
  lastName: string;
  extensionName: string | null;
  phoneNumber: string;
  email: string;
  emailVerifiedAt: string | null;
  role: 'Admin' | 'Meter Reader' | 'Cashier' | 'Head';
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}
