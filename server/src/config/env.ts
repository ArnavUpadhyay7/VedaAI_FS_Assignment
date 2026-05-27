import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string().min(1),
  REDIS_URL: z.string().min(1),
  OPENROUTER_API_KEY: z.string().min(1),
  CLIENT_URL: z.string().url(),
  SERVER_PUBLIC_URL: z.string().url().optional(),
  PDF_DIR: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export function getServerPublicUrl(): string {
  return env.SERVER_PUBLIC_URL ?? `http://localhost:${env.PORT}`;
}
