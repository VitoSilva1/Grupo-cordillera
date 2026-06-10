export interface Env {
  port: number;
  authApiUrl: string;
  kpisApiUrl: string;
  userApiUrl: string;
  allowedOrigins: string[];
}

function readAllowedOrigins(value?: string): string[] {
  return (value || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const env: Env = {
  port: Number(process.env.PORT || 8000),
  authApiUrl: process.env.AUTH_API_URL || 'http://localhost:8080/api/auth',
  kpisApiUrl: process.env.KPIS_API_URL || 'http://localhost:8081/api/kpis',
  userApiUrl: process.env.USER_API_URL || 'http://localhost:8082/api/users',
  allowedOrigins: readAllowedOrigins(process.env.ALLOWED_ORIGINS),
};
