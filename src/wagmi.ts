import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { createConfig } from "wagmi";
import { mainnet } from "wagmi/chains";

export const walletConnectProjectId = import.meta.env.VITE_WC_PROJECT_ID;

const chains = [mainnet] as const;

// Create a wagmi config using the wallet-connect project.
export const config = createConfig({
  chains,
  connectors: w3mConnectors({
    chains: chains as any,
    projectId: walletConnectProjectId,
    version: 2,
  }),
  transports: {
    [mainnet.id]: w3mProvider({ projectId: walletConnectProjectId }),
  },
});

// Export chains for use in other components
export { chains };
