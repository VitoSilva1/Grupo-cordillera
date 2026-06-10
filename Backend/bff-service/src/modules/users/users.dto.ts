export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  [key: string]: unknown;
}

export interface ServiceErrorResponse {
  error?: string;
  [key: string]: unknown;
}
