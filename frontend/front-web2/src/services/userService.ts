import type { CreatedUser, CreateUserPayload, UserProfile } from '../types/user';

const AUTH_API_URL = import.meta.env.VITE_USERS_API_URL || 'http://localhost:8000/api/auth';
const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8000/api/users';

export const userService = {
    getCurrentUser: async (): Promise<UserProfile> => {
        const response = await fetch(`${AUTH_API_URL}/users/me`);
        // const token = localStorage.getItem('token');
        // const response = await fetch(`${API_URL}/users/me`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // });

        if (!response.ok) {
            throw new Error('No se pudo obtener el usuario actual');
        }

        return response.json();
    },

    createUser: async (payload: CreateUserPayload): Promise<CreatedUser> => {
        const response = await fetch(USER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'No se pudo crear el usuario');
        }

        return data as CreatedUser;
    },
};
