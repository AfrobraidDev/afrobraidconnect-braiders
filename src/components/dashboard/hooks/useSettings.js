import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { apiController } from "@/utils/apiController";
import toast from "react-hot-toast";

export const useSettings = () => {
  const { data: session } = useSession();
  const token = session?.accessToken;
  const queryClient = useQueryClient();

  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["braiderProfile"],
    queryFn: () =>
      apiController({
        method: "GET",
        url: "/braiders/profile/",
        token,
        requiresAuth: true,
      }).then((res) => res.data),
    enabled: !!token,
  });

  const updateInfoMutation = useMutation({
    mutationFn: (payload) =>
      apiController({
        method: "PATCH",
        url: "/braiders/profile/info/",
        token,
        data: payload,
        requiresAuth: true,
      }),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["braiderProfile"]);
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const uploadLogoMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("business_logo", file);
      return apiController({
        method: "PATCH",
        url: "/braiders/logo/",
        token,
        data: formData,
        requiresAuth: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Logo uploaded!");
      queryClient.invalidateQueries(["braiderProfile"]);
    },
    onError: () => toast.error("Failed to upload logo."),
  });

  const changePasswordMutation = useMutation({
    mutationFn: (payload) =>
      apiController({
        method: "POST",
        url: "/dashboard/settings/change-password/",
        token,
        data: payload,
        requiresAuth: true,
      }),
    onSuccess: () => toast.success("Password changed successfully."),
    onError: (err) => toast.error(err.message || "Failed to change password."),
  });

  const accountActionMutation = useMutation({
    mutationFn: ({ type }) => {
      const method = type === "delete" ? "DELETE" : "POST";
      const url = `/dashboard/settings/${type}/`;

      return apiController({ method, url, token, requiresAuth: true });
    },
    onSuccess: (_, variables) => {
      if (variables.type === "delete") {
        toast.success("Account deleted. Goodbye.");
      } else {
        toast.success(`Account ${variables.type}d successfully.`);
        queryClient.invalidateQueries(["braiderProfile"]);
      }
    },
    onError: () => toast.error("Action failed."),
  });

  return {
    profile,
    loadingProfile,
    updateProfile: updateInfoMutation.mutate,
    isUpdatingProfile: updateInfoMutation.isPending,
    uploadLogo: uploadLogoMutation.mutate,
    isUploadingLogo: uploadLogoMutation.isPending,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    performAccountAction: accountActionMutation.mutate,
    isPerformingAction: accountActionMutation.isPending,
  };
};
