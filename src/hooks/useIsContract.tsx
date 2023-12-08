import { type Address, usePublicClient, useQuery } from "wagmi";

// Hook for whether the given `address` contains contract code.
export default function useIsContract(address: Address | undefined) {
  const publicClient = usePublicClient();

  return useQuery(["isWalletContract", address ?? ""], async () => {
    if (!address) {
      return false;
    }
    const bytecode = await publicClient.getBytecode({
      address,
    });
    return bytecode !== undefined;
  });
}
