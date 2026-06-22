import type { CreatedUser, CreateUserPayload } from '../types/user';

const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8000/api/users';

export const userService = {
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
