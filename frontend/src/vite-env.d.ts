/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USERS_API_URL: string;
  readonly VITE_USER_API_URL: string;
  readonly VITE_KPIS_API_URL: string;
  readonly VITE_REPORTS_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
