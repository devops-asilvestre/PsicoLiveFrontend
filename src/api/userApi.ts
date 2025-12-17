// src/api/userApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";
import { ApiResponseDto, ApiResponsePagedDto } from "../types/api";

const API_URL = apiEndpoint("/api/user");

export type UserDto = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export async function getUsers(){
  const { data } = await axiosInstance.get<ApiResponsePagedDto<UserDto>[]>(apiEndpoint("/api/User"));
  // Normaliza: se vier array com um item, usa esse item; caso mude para objeto unico, também funciona
  const normalized = Array.isArray(data) ? (data[0] ?? {
    totalRecords: 0, pageSize: 10, currentPage:1, totalPages:0, hasSuccess: true, messageFriendly:"", messageTechnica:"", payload:[], statusCode: 200
  }) : (data as any);
  return normalized as ApiResponsePagedDto<UserDto>;
}

export async function createUser(body: { fullName: string, email: string }) {
  const { data } = await axiosInstance.post<ApiResponseDto<string>>(apiEndpoint("/api/User"), body);
  return data;
}

export async function updateUser(id: string, body: {fullName: string, email: string}) {
  const { data } = await axiosInstance.put<ApiResponseDto<string>>(apiEndpoint(`/api/User/${id}`), body);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await axiosInstance.delete<ApiResponseDto<string>>(apiEndpoint(`/api/User/${id}`));
  return data;
}