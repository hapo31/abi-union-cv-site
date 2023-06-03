"use client";

import styled from "@emotion/styled";
import { AppBar, Toolbar } from "@mui/material";
import { ReactNode } from "react";
import "../styles/globals.css";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        <AppContainer className="app-container">
          <AppBar position="static">
            <Toolbar>
              アークナイツ・ブルアカ・デレ共通の声優を調べるやつ
            </Toolbar>
          </AppBar>
          {children}
        </AppContainer>
      </body>
    </html>
  );
}

const AppContainer = styled.div`
  min-width: 768px;
`;
