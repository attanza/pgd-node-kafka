import ioredis from 'ioredis';
import Logger from 'jet-logger';

class RedisInstance {
  redis: ioredis;
  defaultExpiry = 60 * 60; // 1 hours
  constructor() {
    const REDIS_URL = process.env.REDIS_URL as string;
    this.redis = new ioredis(6379, REDIS_URL, {
      keyPrefix: this.getPrefix(),
      enableAutoPipelining: true,
    });
    this.redis.on('message', (channel: string, message: any) => {
      console.log(`Received ${message} from ${channel}`);
    });
  }

  private getPrefix(): string {
    const REDIS_PREFIX = process.env.REDIS_PREFIX as string;
    if (process.env.NODE_ENV === 'development') {
      return REDIS_PREFIX + 'dev_';
    }
    if (process.env.NODE_ENV === 'staging') {
      return REDIS_PREFIX + 'stg_';
    }
    return REDIS_PREFIX;
  }

  async set(
    key: string,
    value: any,
    exp: number = this.defaultExpiry
  ): Promise<void> {
    Logger.info(`SET ${key}`);
    await this.redis.set(key, JSON.stringify(value), 'EX', exp);
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (data == null) return null;
    else {
      Logger.info(`GET ${key}`);
      return JSON.parse(data);
    }
  }

  async del(key: string): Promise<void> {
    Logger.info(`DELETE ${key}`);
    await this.redis.del(key);
  }

  async getStream(pattern: string): Promise<string[] | void> {
    const prefix = this.getPrefix();
    return new Promise((resolve) => {
      const stream = this.redis.scanStream({
        match: `${prefix}${pattern}*`,
        count: 10,
      });
      stream.on('data', (resultKeys) => {
        resolve(resultKeys);
      });
      stream.on('end', () => {
        return resolve();
      });
    });
  }

  async deletePattern(pattern: string): Promise<void> {
    const prefix = this.getPrefix();
    return new Promise((resolve) => {
      const stream = this.redis.scanStream({
        match: `${prefix}${pattern}*`,
        count: 10,
      });
      const keys: any[] = [];
      stream.on('data', (resultKeys: any) => {
        if (resultKeys.length > 0) {
          resultKeys.map((key: string) => {
            keys.push(key.split(prefix)[1]);
          });
        }
      });
      stream.on('end', () => {
        if (keys.length > 0) {
          this.redis.unlink(keys);
          Logger.info(`DELETE PATTERN ${pattern}`);
        }
        resolve();
      });
    });
  }

  async flushall() {
    await this.redis.flushall();
  }
}

export const Redis = new RedisInstance();
