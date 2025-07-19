import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "./App";
import { chains, config, walletConnectProjectId } from "./wagmi";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

const ethereumClient = new EthereumClient(config, chains as any);
const queryClient = new QueryClient();

const root = document.getElementById("root");
if (!root) {
  throw new Error("missing root div in index.html");
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
        <Web3Modal
          projectId={walletConnectProjectId}
          ethereumClient={ethereumClient}
          themeMode={"dark"}
          themeVariables={{
            // Use our ETH-y secondary color as the accent.
            "--w3m-accent-color": theme.palette.secondary.main,
          }}
        />
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
);
