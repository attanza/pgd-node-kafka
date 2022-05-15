import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import logger from 'jet-logger';
class MqttUtils {
  private client: MqttClient;
  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    const host = process.env.MQTT_HOST;
    const port = process.env.MQTT_HOST;
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const options: IClientOptions = {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    };
    const connectUrl = `mqtt://${host}:${port}`;
    this.client = mqtt.connect(connectUrl, options);

    // Mqtt error calback
    this.client.on('error', (err) => {
      console.log(JSON.stringify(err), 'MQTT: ERROR');
      this.client.end();
    });

    // Connection callback
    this.client.on('connect', (payload: any) => {
      logger.info('mqtt client connected');
    });

    // mqtt subscriptions
    this.client.subscribe('node-kafka/#', {
      qos: 1,
    });

    // When a message arrives, console.log it
    this.client.on('message', (topic, message) => {
      console.log('MQTT: TOPIC', topic);
      console.log('MQTT: MESSAGE', message.toString());
      console.log('================================');
    });

    this.client.on('close', () => {
      console.log('mqtt client disconnected');
    });
  }

  // Sends a mqtt message to topic: myopic
  sendMessage(topic: string, message: string) {
    try {
      this.client.publish(topic, message);
    } catch (e) {
      console.log(JSON.stringify(e), 'MQTT: ERROR');
    }
  }
}

export default new MqttUtils();
