import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().default('fallback_secret_key_minimum_32_characters_long'),
  JWT_EXPIRES_IN: z.string().optional().default('7d'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  EMAIL_HOST: z.string().optional(),
  EMAIL_PORT: z.string().default('587'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
});

export const env = envSchema.parse(process.env);

