import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';
import type { AuthResponse, User } from '../../types/auth';
import type { LoginInput, RegisterInput } from './authSchemas';

export const authApi = {
  login: (input: LoginInput) =>
    unwrap(api.post<ApiResponse<AuthResponse>>('/auth/login', input)),

  register: (input: RegisterInput) =>
    unwrap(api.post<ApiResponse<AuthResponse>>('/auth/register', input)),

  me: () => unwrap(api.get<ApiResponse<User>>('/auth/me')),

  logout: (refreshToken: string) =>
    api.post<ApiResponse<null>>('/auth/logout', { refreshToken }),
};