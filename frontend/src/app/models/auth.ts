export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  role: string;
  user: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  country: string;
}