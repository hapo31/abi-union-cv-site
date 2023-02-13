import fetcher from "@/apiUtil/fetcher";
import "@/styles/globals.css";
import styled from "@emotion/styled";
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
      <AppContainer className="app-container">
        <Component {...pageProps} />
      </AppContainer>
    </SWRConfig>
  );
}

const AppContainer = styled.div`
  min-width: 768px;
`;
