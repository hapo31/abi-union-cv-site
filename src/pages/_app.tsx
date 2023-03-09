import "@/styles/globals.css";
import styled from "@emotion/styled";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppContainer className="app-container">
      <Component {...pageProps} />
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-width: 768px;
`;
