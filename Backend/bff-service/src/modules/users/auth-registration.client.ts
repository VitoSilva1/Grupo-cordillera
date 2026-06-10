import { HttpClient } from '../../shared/http/http-client.js';
import type { CreateUserRequest } from './users.dto.js';

export class AuthRegistrationClient {
  private readonly http: HttpClient;

  constructor(authApiUrl: string) {
    this.http = new HttpClient(authApiUrl);
  }

  registerUser(payload: CreateUserRequest) {
    return this.http.post<unknown, Pick<CreateUserRequest, 'username' | 'email' | 'password' | 'role'>>(
      '/register',
      {
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      },
    );
  }
}
