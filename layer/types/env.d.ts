declare global {
  namespace NodeJS {
    interface ProcessEnv {
      STAGE: string;
      AWS_REGION: string;
      SUPABASE_URL: string;
      SUPABASE_SECRET_KEY: string;
      OPENAI_API_KEY: string;
      ALLOWED_ORIGIN: string;
      UPLOAD_BUCKET: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASS: string;
      SMTP_FROM: string;
      TURNSTILE_SECRET_KEY: string;
      TARGET_LAMBDA_ARN: string;
      STREAMING_LAMBDA_URLS: string;
      SECRETS_MAP: string;
      SECRETS_CACHE_DATE: string;
    }
  }
}

export {}