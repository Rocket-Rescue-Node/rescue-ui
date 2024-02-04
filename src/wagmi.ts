import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";
import { type Chain, type ChainProviderFn } from "@wagmi/core";

export const walletConnectProjectId = import.meta.env?.VITE_WC_PROJECT_ID;

const {
  chains: _chains,
  publicClient,
  webSocketPublicClient,
} = configureChains([mainnet], [
  w3mProvider({ projectId: walletConnectProjectId }),
] as Array<ChainProviderFn<any>>);

export const chains = _chains as Chain[];

// Create a wagmi config using the wallet-connect project.
export const config = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    chains,
    projectId: walletConnectProjectId,
    version: 2,
  }),
  publicClient,
  webSocketPublicClient,
});
