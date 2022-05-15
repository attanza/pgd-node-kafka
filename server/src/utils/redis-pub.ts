import ioredis from 'ioredis';

class RedisPub {
  private redis: ioredis;
  constructor() {
    const REDIS_URL = process.env.REDIS_URL as string;
    this.redis = new ioredis(6379, REDIS_URL);
  }

  publish(channel: string, message: any) {
    this.redis.publish(channel, JSON.stringify(message));
    // console.log('Published %s to %s', message, channel);
  }

  async flushall() {
    await this.redis.flushall();
  }
}

export const redisPub = new RedisPub();
