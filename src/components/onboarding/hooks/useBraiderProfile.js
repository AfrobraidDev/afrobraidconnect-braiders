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
      queryClient.invalidateQueries({ queryKey: ["braiderProfile"] });
    },
  });

  return {
    data: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
