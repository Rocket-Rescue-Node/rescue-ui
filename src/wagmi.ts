import { createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

export const walletConnectProjectId = import.meta.env.VITE_WC_PROJECT_ID;

const chains = [mainnet] as const;

// Create a wagmi config with basic connectors
export const config = createConfig({
  chains,
  connectors: [
    injected(),
    walletConnect({ projectId: walletConnectProjectId }),
  ],
  transports: {
    [mainnet.id]: http(),
  },
});

// Export chains for use in other components
export { chains };
