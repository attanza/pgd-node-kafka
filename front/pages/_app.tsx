import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import MqttContextProvider from "../src/contexts/mqtt.context";

axios.defaults.baseURL = "http://localhost:10000";
const fetcher = (url: string) => axios.get(url).then((res) => res.data);
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 3000,
        fetcher,
      }}
    >
      <MqttContextProvider>
        <Component {...pageProps} />;
      </MqttContextProvider>
    </SWRConfig>
  );
}

export default MyApp;
