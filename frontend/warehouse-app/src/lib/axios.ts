import axios from "axios";
import { attachClientIdentifierInterceptors } from "@/lib/client-identifier";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEST_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

attachClientIdentifierInterceptors(api);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;