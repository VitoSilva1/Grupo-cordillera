import { HttpClient } from '../../shared/http/http-client.js';
import type { CreateUserRequest } from './users.dto.js';

export class UsersClient {
  private readonly http: HttpClient;

  constructor(userApiUrl: string) {
    this.http = new HttpClient(userApiUrl);
  }

  createUser(payload: CreateUserRequest) {
    return this.http.post<unknown, CreateUserRequest>('', payload);
  }
}
