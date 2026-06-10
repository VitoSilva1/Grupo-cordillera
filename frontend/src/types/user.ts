export interface UserProfile {
    id: string;
    name: string;
    role: string;
    email?: string;
    username?: string;
    avatarUrl?: string;
    accessToken?: string;
    tokenType?: string;
    expiresIn?: number;
}

export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface CreatedUser {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
}
