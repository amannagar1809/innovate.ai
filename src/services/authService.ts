import { apiService } from "@/services/apiService";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserPayload {
  id: string;
  name: string;
  email: string;
}

export const authService = {
  login: (payload: LoginPayload) => apiService.post<{ user: UserPayload; token: string }>('/auth/login', payload),
  register: (payload: LoginPayload & { name: string }) => apiService.post<{ user: UserPayload; token: string }>('/auth/register', payload),
  me: () => apiService.get<{ user: UserPayload }>('/auth/me'),
};
