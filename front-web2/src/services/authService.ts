import type { UserProfile } from '../types/user';

const AUTH_API_URL = import.meta.env.VITE_USERS_API_URL || 'http://localhost:8000/api/auth';

interface LoginResponse {
  message?: string;
  username?: string;
  email?: string;
  role?: string;
  error?: string;
}

export const authService = {
  login: async (login: string, password: string): Promise<UserProfile> => {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: login,
        password,
      }),
    });

    const data = await response.json() as LoginResponse;

    if (!response.ok) {
      throw new Error(data.error || 'Error en la autenticacion');
    }

    const username = data.username || login;
    return {
      id: username,
      name: username,
      role: data.role || 'Sin cargo',
      email: data.email ?? (login.includes('@') ? login : undefined),
      username,
    };
  },
};
