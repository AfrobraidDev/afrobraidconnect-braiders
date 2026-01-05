import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";
import { useDebounce } from "./useDebounce";

export const useClients = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["clientStats"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/stats/clients/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const {
    data: clientsData,
    isLoading: loadingClients,
    isPlaceholderData,
  } = useQuery({
    queryKey: ["clientsList", page, debouncedSearch],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/clients/",
        token,
        requiresAuth: true,
        params: {
          page,
          page_size: 10,
          searchTerm: debouncedSearch || undefined,
        },
      }).then((res) => res.data),
    enabled: !!token,
    placeholderData: keepPreviousData,
  });

  return {
    stats,
    clients: clientsData?.results || [],
    totalCount: clientsData?.count || 0,

    page,
    setPage,
    searchTerm,
    setSearchTerm,

    isLoading: loadingStats || loadingClients,
    isPlaceholderData,
  };
};
