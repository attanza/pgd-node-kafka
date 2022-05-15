import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import MqttContextProvider from "../src/contexts/mqtt.context";
import { API_URL } from "../src/utils/constants";

function MyApp({ Component, pageProps }: AppProps) {
  axios.defaults.baseURL = API_URL;
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
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
