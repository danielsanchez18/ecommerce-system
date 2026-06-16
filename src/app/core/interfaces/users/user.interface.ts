export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  FACEBOOK = 'FACEBOOK'
}

export interface CreateUserRequest {
  names: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  password?: string;
  photoUrl?: string;
}

export interface UpdateEmailRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface UpdateProfileRequest {
  names: string;
  phoneNumber?: string;
  address?: string;
  photoUrl?: string;
}

export interface UpdateUserStatusRequest {
  enabled: boolean;
}

export interface UserResponse {
  id: string;
  names: string;
  email: string;
  phoneNumber?: string;
  photoUrl?: string;
  enabled: boolean;
  provider: AuthProvider;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface UserFilters {
  names?: string;
  email?: string;
  provider?: AuthProvider;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  deleted?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
