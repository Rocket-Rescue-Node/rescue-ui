import { useQuery } from "wagmi";
import { getAddress, recoverMessageAddress } from "viem";

// Hook for whether the given `value` contains JSON of a valid signed message.
export default function useIsValidSignedMessage(value: string) {
  return useQuery(
    ["isValidSignedMessage", value || ""],
    async () => {
      try {
        const { address, msg, sig, version } = JSON.parse(value);
        const recoveredAddress = await recoverMessageAddress({
          message: msg,
          signature: sig,
        });
        return getAddress(address) === recoveredAddress && version === "1";
      } catch (e) {
        return false;
      }
    },
    {
      enabled: !!value,
    },
  );
}
