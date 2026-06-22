export interface AuthenticatedUser {
  username: string;
  email?: string;
  role?: string;
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
}
