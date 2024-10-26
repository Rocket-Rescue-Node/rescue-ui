import { useQuery } from "wagmi";
import { Api, OperatorInfo } from "../Api"

// Hook to retrieve OperatorInfo from API
export default function useGetOperatorInfo({
  signedMessage,
  operatorType,
  enabled,
  onData,
  onError,
  onSuccess,
}: {
  signedMessage: string,
  operatorType: "solo" | "rocketpool",
  enabled: boolean
  onData: (data: OperatorInfo) => void
  onError: (error: string) => void
  onSuccess?: () => void
}) {
  return useQuery<boolean, Error>(
    ["Api.getOperatorInfo", signedMessage, operatorType],
    async () => { 
        try { 
          await Api.getOperatorInfo(
            { body: signedMessage, query: { operator_type: operatorType } },
            onData, onError, onSuccess ? onSuccess : () => {}
          )
          return true
        }
        catch(e) {
          console.log("Error retrieving operator info:", e)
          return false
        }
    },
    {
      enabled: enabled
    },
  );
}