import mqtt, { IClientOptions, MqttClient } from "mqtt";
import {
  MQTT_HOST,
  MQTT_PASSWORD,
  MQTT_PORT,
  MQTT_USERNAME,
} from "./constants";

class MqttHandler {
  private mqttClient: MqttClient;

  connect() {
    const host = MQTT_HOST;
    const port = MQTT_PORT;
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const options: IClientOptions = {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
    };
    const connectUrl = `ws://${host}:${port}`;
    this.mqttClient = mqtt.connect(connectUrl, options);

    // Mqtt error calback
    this.mqttClient.on("error", (err) => {
      console.log(err); // eslint-disable-line
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      console.log("MQTT connected");
    });

    this.mqttClient.on("close", () => {
      console.log("mqtt client disconnected"); // eslint-disable-line
    });
  }

  subscribe(topic: string, action: any): void {
    this.mqttClient.subscribe(topic, {
      qos: 1,
    });
    console.log(`subscribed to topic ${topic}`);

    this.mqttClient.on("message", (topic, message) => {
      action(topic, message);
    });
  }

  unsubscribe(topic: string): void {
    console.log(`unsubscribe from topic ${topic}`);
    this.mqttClient.unsubscribe(topic);
  }

  getClient() {
    return this.mqttClient;
  }
}
const mqttHandler = new MqttHandler();
export default mqttHandler;
