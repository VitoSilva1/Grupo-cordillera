import { AppError } from '../../shared/errors/app-error.js';
import { AuthRegistrationClient } from './auth-registration.client.js';
import type { CreateUserRequest, ServiceErrorResponse } from './users.dto.js';
import { UsersClient } from './users.client.js';

export class UsersService {
  constructor(
    private readonly usersClient: UsersClient,
    private readonly authRegistrationClient: AuthRegistrationClient,
  ) {}

  async createUser(payload: CreateUserRequest): Promise<unknown> {
    const userResponse = await this.usersClient.createUser(payload);
    const userAlreadyExists = this.isUserAlreadyExists(userResponse.data);

    if (!userResponse.ok && !userAlreadyExists) {
      throw new AppError('No se pudo crear el usuario', userResponse.status, undefined, userResponse.data);
    }

    const authResponse = await this.authRegistrationClient.registerUser(payload);
    if (!authResponse.ok) {
      throw new AppError(
        'No se pudo registrar credenciales del usuario',
        authResponse.status,
        undefined,
        authResponse.data,
      );
    }

    return userAlreadyExists ? authResponse.data : userResponse.data;
  }

  private isUserAlreadyExists(payload: unknown): boolean {
    const error = (payload as ServiceErrorResponse | undefined)?.error;

    return typeof error === 'string'
      && (error.includes('usuario ya existe') || error.includes('email ya existe'));
  }
}
