import { usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";

// Hook for whether the given `value` contains JSON of a valid signed message.
export default function useIsValidSignedMessage(value: string) {
  const publicClient = usePublicClient();

  return useQuery<boolean>({
    queryKey: ["isValidSignedMessage", value || ""],
    queryFn: async () => {
      if (!publicClient) {
        throw new Error("Public client not available");
      }

      try {
        const { address, msg, sig, version } = JSON.parse(value);
        const isValid = await publicClient.verifyMessage({
          message: msg,
          signature: sig,
          address,
        });

        return isValid && version === "1";
      } catch (e) {
        console.error("Error parsing signed message:", e);
        return false;
      }
    },
    enabled: !!value && !!publicClient,
  });
}
