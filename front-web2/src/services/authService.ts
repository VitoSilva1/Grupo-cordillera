import type { UserProfile } from '../types/user';

const AUTH_API_URL = import.meta.env.VITE_USERS_API_URL;

interface LoginResponse {
  message?: string;
  username?: string;
  error?: string;
}

interface AuthUser {
  username: string;
  email?: string;
  role: string;
}

const toUserProfile = (user: AuthUser, login: string): UserProfile => ({
  id: user.username,
  name: user.username,
  role: user.role,
  email: user.email ?? login,
  username: user.username,
});

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

    const usersResponse = await fetch(`${AUTH_API_URL}/users`);
    if (!usersResponse.ok) {
      return {
        id: data.username || login,
        name: data.username || login,
        role: 'Sin cargo',
        email: login.includes('@') ? login : undefined,
        username: data.username || login,
      };
    }

    const users = await usersResponse.json() as AuthUser[];
    const normalizedLogin = login.trim().toLowerCase();
    const normalizedUsername = data.username?.trim().toLowerCase();

    const matchedUser = users.find((user) =>
      user.email?.toLowerCase() === normalizedLogin ||
      user.username.toLowerCase() === normalizedLogin ||
      user.username.toLowerCase() === normalizedUsername
    );

    if (!matchedUser) {
      return {
        id: data.username || login,
        name: data.username || login,
        role: 'Sin cargo',
        email: login.includes('@') ? login : undefined,
        username: data.username || login,
      };
    }

    return toUserProfile(matchedUser, login);
  },
};
