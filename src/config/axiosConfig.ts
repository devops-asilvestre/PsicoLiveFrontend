// src/config/axiosConfig.ts
import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de requisição: injeta Authorization se houver token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta: normaliza erro
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const backend = error?.response?.data;
    const friendly =
      backend?.messageFriendly ||
      backend?.Message ||
      error?.message ||
      "Erro na comunicação com a API.";
    const technica = backend?.messageTechnica ? ` (${backend.messageTechnica})` : "";
    const normalized = new Error(`${friendly}${technica}`);
    (normalized as any).original = error;
    return Promise.reject(normalized);
  }
);
