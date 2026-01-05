import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Use environment variable for production, fallback to proxy for development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8800";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api`,
    credentials: "include",
  }),
  tagTypes: ["Task", "User"],
  endpoints: (builder) => ({}),
});