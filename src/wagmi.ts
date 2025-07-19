import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

export const walletConnectProjectId = import.meta.env.VITE_WC_PROJECT_ID;

// Create the Wagmi adapter
export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet],
  projectId: walletConnectProjectId,
});

// Create Reown AppKit
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet],
  projectId: walletConnectProjectId,
  metadata: {
    name: "Rescue Node",
    description: "Rescue Node UI",
    url:
      typeof window !== "undefined"
        ? window.location.origin
        : "https://rescuenode.com",
    icons: ["https://rescuenode.com/favicon.ico"],
  },
});

export { WagmiProvider } from "wagmi";
