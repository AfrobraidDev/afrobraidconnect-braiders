// src/utils/apiController.js
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

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
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
    console.error("API Controller Error:", error.response || error.message);
    throw (
      error.response?.data || new Error("An unexpected API error occurred.")
    );
  }
};
