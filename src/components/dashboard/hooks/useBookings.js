import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";
import { useDebounce } from "./useDebounce";

export const useBookings = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounce(searchTerm, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["braiderStats"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/braider-stats/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const {
    data: bookingsData,
    isLoading: loadingBookings,
    isPlaceholderData,
  } = useQuery({
    queryKey: [
      "bookingsList",
      page,
      debouncedSearch,
      statusFilter,
      dateRange,
      priceRange,
    ],
    queryFn: async () => {
      const params = {
        page,
        page_size: 10,
        searchTerm: debouncedSearch || undefined,
        status: statusFilter === "All" ? undefined : statusFilter,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined,
      };

      const response = await apiController({
        method: "GET",
        url: "/bookings/manage/all/",
        token,
        requiresAuth: true,
        params,
      });
      return response.data?.data;
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });

  return {
    stats,
    bookings: bookingsData?.results || [],
    totalCount: bookingsData?.count || 0,

    isLoading: loadingStats || loadingBookings,
    isPlaceholderData,

    page,
    setPage,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    priceRange,
    setPriceRange,
  };
};
