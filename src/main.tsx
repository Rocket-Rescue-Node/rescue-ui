import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";

import { App } from "./App";
import { config } from "./wagmi";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

const root = document.getElementById("root");
if (!root) {
  throw new Error("missing root div in index.html");
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
