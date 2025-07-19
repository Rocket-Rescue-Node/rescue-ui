import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import { wagmiAdapter } from "./wagmi";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) {
  throw new Error("missing root div in index.html");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
