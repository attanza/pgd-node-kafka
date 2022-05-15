import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
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
      <Component {...pageProps} />;
    </SWRConfig>
  );
}

export default MyApp;
