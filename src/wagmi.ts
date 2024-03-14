import theme from "./theme";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { walletConnectProvider } from "@web3modal/wagmi";
import { configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { type Chain, type ChainProviderFn } from "@wagmi/core";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { InjectedConnector } from "wagmi/connectors/injected";

const walletConnectProjectId = import.meta.env?.VITE_WC_PROJECT_ID;

const {
  chains: _chains,
  publicClient,
  webSocketPublicClient,
} = configureChains([mainnet], [
  walletConnectProvider({ projectId: walletConnectProjectId }),
] as Array<ChainProviderFn<any>>);

export const chains = _chains as Chain[];

// Create a wagmi config using the wallet-connect project.
export const config = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId,
        showQrModal: false,
      },
    }),
    new InjectedConnector({
      chains,
      options: { shimDisconnect: true },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export const modal = createWeb3Modal({
  wagmiConfig: config,
  projectId: walletConnectProjectId,
  chains,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": theme.palette.secondary.main,
  },
});
