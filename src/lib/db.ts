import { Redis } from "@upstash/redis";

import { env } from "~/env.mjs";

const globalForRedis = globalThis as unknown as { redis: Redis };

const redis =
  globalForRedis.redis ||
  new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN,
  });

if (env.NODE_ENV !== "production") globalForRedis.redis = redis;

export default redis;
