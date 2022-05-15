import { cleanEnv, port, str } from 'envalid';

export function validateEnv() {
  cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str({ choices: ['development', 'production', 'staging'] }),
    JWT_SECRET: str(),
    MONGO_URI: str(),
    REDIS_URL: str(),
    REDIS_PORT: port(),
    REDIS_PREFIX: str(),
    MQTT_HOST: str(),
    MQTT_PORT: str(),
    MQTT_USERNAME: str(),
    MQTT_PASSWORD: str(),
    KAFKA_URL: str(),
  });
}
