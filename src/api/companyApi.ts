// src/api/companyApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";

const API_URL = apiEndpoint("/api/company");

export type ApiResponseDto<T = any> = {
  hasSuccess: boolean;
  messageFriendly?: string;
  messageTechnica?: string;
  payload: T;
  statusCode: number;
};

export type CompanyDto = {
  id: string;
  name: string;
  cnpj: string;
};

export async function getCompanies(): Promise<ApiResponseDto<CompanyDto[]>> {
  const { data } = await axiosInstance.get<ApiResponseDto<CompanyDto[]>>(API_URL);
  return data;
}

export async function createCompany(name: string, cnpj: string): Promise<ApiResponseDto<CompanyDto>> {
  const { data } = await axiosInstance.post<ApiResponseDto<CompanyDto>>(API_URL, { name, cnpj });
  return data;
}
