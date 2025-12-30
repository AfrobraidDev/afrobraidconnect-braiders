import axios from "axios";

export const apiController = async ({
  method,
  url,
  data = null,
  params = null,
  requiresAuth = false,
  token = null,
}) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;

  const isFormData = data instanceof FormData;

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Accept: "application/json",
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });

  if (requiresAuth) {
    if (!token) {
      return Promise.reject(
        new Error("Authentication token is missing for a protected route.")
      );
    }
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await axiosInstance({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("API Error Status:", error.response.status);
      console.error("API Error Data:", error.response.data);
      throw error.response.data;
    } else if (error.request) {
      console.error("API No Response:", error.request);
      throw new Error("No response from server. Please check your connection.");
    } else {
      console.error("API Setup Error:", error.message);
      throw error;
    }
  }
};
