// src/api/userApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";
import type { ApiResponseDto } from "./companyApi";

const API_URL = apiEndpoint("/api/user");

export type UserDto = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export async function getUsers(): Promise<ApiResponseDto<UserDto[]>> {
  const { data } = await axiosInstance.get<ApiResponseDto<UserDto[]>>(API_URL);
  return data;
}
