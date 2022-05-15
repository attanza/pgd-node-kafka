import { MqttClient } from "mqtt";
import React, { createContext, useContext, useEffect, useState } from "react";
import mqttHandler from "../utils/mqtt";

type TMqttContext = {
  client: MqttClient | undefined;
};

const initialValues = {
  client: undefined,
};

const MqttContext = createContext<TMqttContext>(initialValues);

const MqttContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const [client, setClient] = useState<MqttClient>();

  useEffect(() => {
    mqttHandler.connect();
    setClient(mqttHandler.getClient());
  }, []);
  return (
    <MqttContext.Provider value={{ client }}>{children}</MqttContext.Provider>
  );
};

export function useMqtt() {
  return useContext(MqttContext);
}

export default MqttContextProvider;
