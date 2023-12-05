import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

export const walletConnectProjectId = import.meta.env?.VITE_WC_PROJECT_ID;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [w3mProvider({ projectId: walletConnectProjectId })],
);

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

export { chains };
