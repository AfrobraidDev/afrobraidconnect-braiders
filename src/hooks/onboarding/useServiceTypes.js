import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController"; // Adjust the import path as needed
import { toast } from "react-hot-toast"; // Or your preferred notification library

export const useServiceTypes = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const token = session?.accessToken;

  // Query to fetch all available service types
  const {
    data: serviceTypes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["serviceTypes"], // Unique key for this query
    queryFn: async () => {
      const response = await apiController({
        method: "GET",
        url: "/braiders/service-types/",
        requiresAuth: true,
        token: token,
      });
      // The actual data is nested in the 'data' property
      return response.data;
    },
    // The query will only run if the token exists
    enabled: !!token,
  });

  // Mutation to update the user's selected service types
  const { mutate: updateServiceTypes, isPending: isUpdating } = useMutation({
    mutationFn: (selectedIds) => {
      // The payload needs to be in the format { service_types: [...] }
      const payload = { service_types: selectedIds };

      return apiController({
        method: "PATCH",
        url: "/braiders/profile/service-types/",
        data: payload,
        requiresAuth: true,
        token: token,
      });
    },
    onSuccess: () => {
      toast.success("Service types updated successfully!");
      // Optionally invalidate queries to refetch data if needed elsewhere
      queryClient.invalidateQueries({ queryKey: ["braiderProfile"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update service types.");
    },
  });

  return {
    serviceTypes, // The array of available service types
    isLoading, // True while fetching
    isError,
    error, // The error object
    updateServiceTypes, // The function to call to PATCH data
    isUpdating, // True while patching
  };
};
