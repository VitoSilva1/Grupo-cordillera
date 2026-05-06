import type { UserProfile } from '../types/user';

const API_URL = import.meta.env.VITE_USERS_API_URL;

export const userService = {
    getCurrentUser: async (): Promise<UserProfile> => {
        const response = await fetch(`${API_URL}/users/me`);
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
};
