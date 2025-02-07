import type Redis from 'ioredis'
import type { ICache } from 'tnwx'

export class TokenCache implements ICache {
  private redis: Redis

  constructor(redis: Redis) {
    this.redis = redis
  }

  async get(key: string) {
    return await this.redis.get(key)
  }

  async set(key: string, jsonValue: string) {
    return await this.redis.set(key, jsonValue)
  }

  async remove(key: string) {
    return await this.redis.del(key)
  }
}
