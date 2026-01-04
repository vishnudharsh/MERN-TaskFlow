import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Remove the full URL, use relative path
const API_URL = "/api"; // Changed from "http://localhost:8800/api"

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    credentials: "include",
  }),
  tagTypes: ["Task", "User"],
  endpoints: (builder) => ({}),
});
