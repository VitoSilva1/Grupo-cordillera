export const servicesConfig = {
  authApiUrl: process.env.AUTH_API_URL ?? 'http://localhost:8080/api/auth',
  kpisApiUrl: process.env.KPIS_API_URL ?? 'http://localhost:8081/api/kpis',
  userApiUrl: process.env.USER_API_URL ?? 'http://localhost:8082/api/users',
  reportApiUrl: process.env.REPORT_API_URL ?? 'http://localhost:8082/api/reports',
};
