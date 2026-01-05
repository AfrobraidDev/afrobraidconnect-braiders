import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";

export const useDashboard = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/stats/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const { data: upcoming, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["dashboardUpcoming"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/appointments/upcoming/?page=1&page_size=1",
        token,
        requiresAuth: true,
      }).then((res) => {
        return res.data?.data?.results?.[0] || null;
      }),
    enabled: !!token,
  });

  const { data: recent, isLoading: loadingRecent } = useQuery({
    queryKey: ["dashboardRecent"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/dashboard/appointments/recent/?page=1&page_size=5",
        token,
        requiresAuth: true,
      }).then((res) => {
        return res.data?.data?.results || [];
      }),
    enabled: !!token,
  });

  const { data: inbox, isLoading: loadingInbox } = useQuery({
    queryKey: ["dashboardInbox"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/chat/inbox/",
        token,
        requiresAuth: true,
      }).then((res) => res.data || []),
    enabled: !!token,
  });

  return {
    stats,
    nextAppointment: upcoming,
    recentBookings: recent,
    messages: inbox,
    isLoading: loadingStats || loadingUpcoming || loadingRecent || loadingInbox,
  };
};
