export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

export interface AuthState {
  token: string | null;
  user: User | null;
}
export interface LoginResponse {
  token: string;
  user: User;
}

