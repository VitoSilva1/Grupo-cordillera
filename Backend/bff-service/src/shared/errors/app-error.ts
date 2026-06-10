export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode = 500,
    public readonly details?: unknown,
    public readonly responseBody?: unknown,
  ) {
    super(message);
  }
}
