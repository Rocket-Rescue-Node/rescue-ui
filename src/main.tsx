import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";

import { App } from "./App";
import { chains, config, walletConnectProjectId } from "./wagmi";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const ethereumClient = new EthereumClient(config, chains);

const root = document.getElementById("root");
if (!root) {
  throw new Error("missing root div in index.html");
}
ReactDOM.createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
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
    </React.StrictMode>
  </QueryClientProvider>,
);
