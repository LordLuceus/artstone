import { env } from "$env/dynamic/private";
import IoRedis from "ioredis";

export const redis = new IoRedis({
  host: "valkey-server",
  port: 6379,
  password: env.REDIS_PASSWORD
});
