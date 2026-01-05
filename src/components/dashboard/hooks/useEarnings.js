import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";

export const useEarnings = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["earningsStats"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/stats/earnings/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const { data: graphData, isLoading: loadingGraph } = useQuery({
    queryKey: ["earningsGraph"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/stats/earnings-graph/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const { data: transactionsData, isLoading: loadingTransactions } = useQuery({
    queryKey: ["earningsTransactions"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/transactions/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const { data: insights, isLoading: loadingInsights } = useQuery({
    queryKey: ["earningsInsights"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/stats/insights/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  return {
    stats,
    graphData,
    transactions: transactionsData?.results || [],
    insights,
    isLoading:
      loadingStats || loadingGraph || loadingTransactions || loadingInsights,
  };
};
