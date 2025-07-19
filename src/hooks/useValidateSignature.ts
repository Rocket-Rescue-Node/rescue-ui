import { useState, useEffect } from "react";
import type { Address, Hex } from "viem";
import { usePublicClient } from "wagmi";

const useValidateSignature = ({
  message,
  signature,
  address,
}: {
  message: string;
  signature: Hex | undefined;
  address: Address | undefined;
}) => {
  const publicClient = usePublicClient();
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!signature || !address || !publicClient) {
      setValid(false);
      return;
    }

    void publicClient
      .verifyMessage({
        message,
        signature,
        address,
      })
      .then(setValid);
  }, [message, signature, address, publicClient]);

  return { data: valid };
};

export default useValidateSignature;
