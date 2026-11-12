import { useQuery } from "@tanstack/react-query";
import { Api } from "../Api";
import type { LifetimeStats } from "../Api";

// Hook to retrieve lifetime usage stats from the API (for the front page).
export default function useGetLifetimeStats() {
  return useQuery<LifetimeStats, Error>({
    queryKey: ["Api.getLifetimeStats"],
    queryFn: async () => {
      let error: string | undefined;
      let data: LifetimeStats | undefined;
      await Api.getLifetimeStats(
        {},
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
    staleTime: 60_000,
  });
}
