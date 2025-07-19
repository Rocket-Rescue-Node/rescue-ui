import { useQuery } from "@tanstack/react-query";
import { Api } from "../Api";
import type { OperatorInfo } from "../Api";

// Hook to retrieve OperatorInfo from API
export default function useGetOperatorInfo({
  signedMessage,
  operatorType,
  enabled,
}: {
  signedMessage: string;
  operatorType: "solo" | "rocketpool";
  enabled: boolean;
}) {
  return useQuery<OperatorInfo, Error>({
    queryKey: ["Api.getOperatorInfo", signedMessage, operatorType],
    queryFn: async () => {
      let error: string | undefined;
      let data: OperatorInfo | undefined;
      await Api.getOperatorInfo(
        { body: signedMessage, query: { operator_type: operatorType } },
        (d) => (data = d),
        (e) => (error = e),
        () => {},
      );

      if (error) {
        throw new Error(error);
      }
      if (!data) {
        throw new Error("null data received from api");
      }
      return data;
    },
    enabled,
  });
}
