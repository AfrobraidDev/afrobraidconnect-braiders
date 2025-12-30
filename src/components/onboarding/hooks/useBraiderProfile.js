import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";

export const useBraiderProfile = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ["braiderProfile"],
    queryFn: async () => {
      const response = await apiController({
        method: "GET",
        url: "/braiders/profile/",
        requiresAuth: true,
        token: session?.accessToken,
      });
      return response.data;
    },
    enabled: !!session?.accessToken,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload) =>
      apiController({
        method: "PATCH",
        url: "/braiders/profile/info/",
        data: payload,
        requiresAuth: true,
        token: session?.accessToken,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["braiderProfile"]);
    },
  });

  return {
    data: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
