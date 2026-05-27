import { createClient } from "redis";
import { env } from "./env";

function isTlsRedisUrl(url: string): boolean {
  return url.startsWith("rediss://");
}

function safeRedisUrlForLogs(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.password) parsed.password = "****";
    return parsed.toString();
  } catch {
    return url;
  }
}

export const redisClient = createClient({
  url: env.REDIS_URL,
  socket: ({
    ...(isTlsRedisUrl(env.REDIS_URL) ? { tls: true } : {}),
    reconnectStrategy: (retries: number) => Math.min(1000 * 2 ** retries, 15_000),
  } as unknown) as any,
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

export async function connectRedis(): Promise<void> {
  if (!redisClient.isOpen) {
    try {
      await redisClient.connect();
      await redisClient.ping();
    } catch (err) {
      console.error(
        `Failed to connect to Redis (${safeRedisUrlForLogs(env.REDIS_URL)}).`
      );
      throw err;
    }
  }
}

export function getBullMqConnection() {
  const isTls = isTlsRedisUrl(env.REDIS_URL);
  return isTls ? { url: env.REDIS_URL, tls: {} } : { url: env.REDIS_URL };
}
