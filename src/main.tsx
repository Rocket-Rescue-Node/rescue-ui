import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";

import { App } from "./App";
import { chains, config, walletConnectProjectId } from "./wagmi";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

const ethereumClient = new EthereumClient(config, chains);

ReactDOM.createRoot(document.getElementById("root")!).render(
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
  </React.StrictMode>,
);
