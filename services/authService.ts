import { apiClient } from './apiClient';
import type { User } from '../store/appStore';

interface AuthResponse {
  user: User;
  accessToken: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/login', { email, password }, false);
}

export async function register(
  name: string,
  organization: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>(
    '/auth/register',
    { name, organization, email, password },
    false,
  );
}
