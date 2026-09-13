import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    // Fail loudly at startup rather than silently using an undefined secret/URL.
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  rapidApi: {
    key: process.env.RAPIDAPI_KEY ?? "",
    host: process.env.RAPIDAPI_HOST ?? "indian-ipo-wallah.p.rapidapi.com",
  },
  ipoGuru: {
    apiKey: process.env.IPOGURU_API_KEY ?? "",
  },
  nodeEnv: process.env.NODE_ENV ?? "development",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL ?? "",
  jwtSecret: process.env.JWT_SECRET ?? "dev-only-insecure-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL ?? "admin@example.com",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD ?? "change_this_password",
  enableCron: (process.env.ENABLE_CRON ?? "true") === "true",
  cron: {
    gmp: process.env.GMP_CRON_SCHEDULE ?? "*/30 * * * *",
    status: process.env.STATUS_CRON_SCHEDULE ?? "*/30 * * * *",
    subscription: process.env.SUBSCRIPTION_CRON_SCHEDULE ?? "*/30 * * * *",
    upcoming: process.env.UPCOMING_CRON_SCHEDULE ?? "0 * * * *",
    articles: process.env.ARTICLES_CRON_SCHEDULE ?? "0 * * * *",
    reviews: process.env.REVIEWS_CRON_SCHEDULE ?? "0 */3 * * *",
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000),
    max: Number(process.env.RATE_LIMIT_MAX ?? 120),
  },
};

void required; // kept for future strict-mode validation of secrets in production
