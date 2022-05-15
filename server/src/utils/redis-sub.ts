import ioredis from 'ioredis';

class RedisSub {
  private redis: ioredis;
  constructor() {
    const REDIS_URL = process.env.REDIS_URL as string;
    this.redis = new ioredis(6379, REDIS_URL);
  }

  subscribe(channel: string) {
    this.redis.psubscribe(channel, (err, count) => {
      if (err) {
        // Just like other commands, subscribe() can fail for some reasons,
        // ex network issues.
        console.error('Failed to subscribe: %s', err.message);
      } else {
        // `count` represents the number of channels this client are currently subscribed to.
        console.log(
          `Subscribed successfully! This client is currently subscribed to ${count} channels.`
        );
      }
    });

    this.redis.on('pmessage', (pattern, channel, message) => {
      // console.log(`Received ${message} from ${channel}`);
      console.log({ pattern, channel, message });
    });
  }

  async flushall() {
    await this.redis.flushall();
  }
}

export const redisSub = new RedisSub();
