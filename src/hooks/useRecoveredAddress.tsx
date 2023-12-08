import { useEffect, useState } from "react";
import { type Address } from "wagmi";
import { recoverMessageAddress } from "viem";

// Hook for the signing address recovered from the given `message` and `signature`.
export default function useRecoveredAddress({
  message,
  signature,
}: {
  message: string;
  signature: `0x${string}` | undefined;
}): {
  recoveredAddress: Address | undefined;
} {
  const [recoveredAddress, setRecoveredAddress] = useState<Address>();
  useEffect(() => {
    (async () => {
      if (message && signature) {
        const recoveredAddress = await recoverMessageAddress({
          message,
          signature,
        });
        setRecoveredAddress(recoveredAddress);
      }
    })().catch(() => {});
  }, [signature, message]);
  return {
    recoveredAddress,
  };
}
