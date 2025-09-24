// Raw API response
export interface AuthApiResponse {
  code: number;
  message: string;
  content: {
    token: string;
    user: {
      id: number;
      full_name: string;
      status: string;
      email: string;
      role: string;
    };
  };
}

// Domain Auth model
export interface Auth {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
  token: string;
}

// Entity
export class AuthEntity implements Auth {
  id!: number;
  fullName: string = '';
  email: string = '';
  role: string = '';
  status: string = '';
  token: string = '';

  constructor(partial: Partial<Auth> = {}) {
    Object.assign(this, partial);
  }

  static fromApiResponse(apiResponse: AuthApiResponse): AuthEntity {
    const { content } = apiResponse;

    return new AuthEntity({
      id: content.user.id,
      fullName: content.user.full_name,
      email: content.user.email,
      role: content.user.role,
      status: content.user.status,
      token: content.token,
    });
  }
}
