export interface AuthRequest {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserResponse {
  id: string;
  names: string;
  email: string;
  roles: string[];
  permissions: string[];
}
