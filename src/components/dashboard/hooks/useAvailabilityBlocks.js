import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";
import toast from "react-hot-toast";

export const useAvailabilityBlocks = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ["scheduleBlocks"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/blocks/",
        token,
        requiresAuth: true,
      }).then((res) => res.data || []),
    enabled: !!token,
  });

  const createBlockMutation = useMutation({
    mutationFn: (payload) =>
      apiController({
        method: "POST",
        url: "/braiders/blocks/",
        token,
        data: payload,
        requiresAuth: true,
      }),
    onSuccess: () => {
      toast.success("Time off blocked successfully.");
      queryClient.invalidateQueries(["scheduleBlocks"]);
    },
    onError: () => toast.error("Failed to block time."),
  });

  const setDailyMutation = useMutation({
    mutationFn: (payload) =>
      apiController({
        method: "POST",
        url: "/braiders/blocks/set-daily-availability/",
        token,
        data: payload,
        requiresAuth: true,
      }),
    onSuccess: () => {
      toast.success("Daily hours updated.");
      queryClient.invalidateQueries(["scheduleBlocks"]);
    },
    onError: () => toast.error("Failed to set daily hours."),
  });

  const deleteBlockMutation = useMutation({
    mutationFn: (uuid) =>
      apiController({
        method: "DELETE",
        url: `/braiders/blocks/${uuid}/`,
        token,
        requiresAuth: true,
      }),
    onSuccess: () => {
      toast.success("Block removed.");
      queryClient.invalidateQueries(["scheduleBlocks"]);
    },
    onError: () => toast.error("Failed to remove block."),
  });

  return {
    blocks: blocks || [],
    isLoading,
    createBlock: createBlockMutation.mutate,
    isCreatingBlock: createBlockMutation.isPending,
    setDailyAvailability: setDailyMutation.mutate,
    isSettingDaily: setDailyMutation.isPending,
    deleteBlock: deleteBlockMutation.mutate,
    isDeleting: deleteBlockMutation.isPending,
  };
};
