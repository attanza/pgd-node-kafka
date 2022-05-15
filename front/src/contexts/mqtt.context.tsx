import { IClientOptions, MqttClient } from "mqtt";
import { createContext, useContext, useEffect, useState } from "react";
import mqtt from "mqtt";
type TMqttContext = {
  client: MqttClient | null;
};

const initialValues = {
  client: null,
};

const MqttContext = createContext<TMqttContext>(initialValues);

const MqttContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [client, setClient] = useState<MqttClient | null>(null);

  const setMqttClient = () => {
    console.log("Set MQTT CLient");

    const host = "my.mqtt.io";
    const port = "8883";
    const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
    const options: IClientOptions = {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
      username: "mqtt_user",
      password: "mqtt_user123",
    };
    const connectUrl = `ws://${host}:${port}`;
    const mqttClient = mqtt.connect(connectUrl, options);

    mqttClient.on("error", (err) => {
      console.log(err); // eslint-disable-line
      mqttClient.end();
    });

    // Connection callback
    mqttClient.on("connect", () => {});

    mqttClient.on("close", () => {
      console.log("mqtt client disconnected"); // eslint-disable-line
    });

    setClient(mqttClient);
  };
  useEffect(() => {
    setMqttClient();
  }, []);
  return (
    <MqttContext.Provider value={{ client }}>{children}</MqttContext.Provider>
  );
};

export function useMqtt() {
  return useContext(MqttContext);
}

export default MqttContextProvider;
