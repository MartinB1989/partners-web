export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}
export interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}
export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  expiresIn: number | null
  user: User | null;
}
export interface LoginResponse {
  tokens: TokenResponse;
  user: User;
}

