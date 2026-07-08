const toNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toOrigins = (value: string | undefined): string[] =>
  (value ?? 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

export const envConfig = {
  port: toNumber(process.env.PORT, 8000),
  allowedOrigins: toOrigins(process.env.ALLOWED_ORIGINS),
};
