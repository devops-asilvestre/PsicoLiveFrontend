// src/api/authApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";

const API_URL = apiEndpoint("/api/Auth");

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  roleName: "Admin" | "Psicologo" | "Cliente";
  companyId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: { id: string; fullName: string; email: string };
  roles: string[];
};

/**
 * Registra um novo usuário no sistema
 */
export async function registerUser(req: RegisterRequest) {
  const { data } = await axiosInstance.post(`${API_URL}/register`, req, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}

/**
 * Realiza login e retorna token + dados do usuário
 */
export async function login(req: LoginRequest): Promise<LoginResponse> {
  const { data } = await axiosInstance.post<LoginResponse>(`${API_URL}/login`, req, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
