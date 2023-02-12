import fetcher from "@/apiUtil/fetcher";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr/_internal";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetcher,
        revalidateIfStale: false,
        refreshWhenHidden: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        errorRetryCount: 3,
        // fallbackData: {},
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
