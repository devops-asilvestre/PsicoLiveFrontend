// src/api/companyApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";
import { ApiResponseDto, ApiResponsePagedDto } from "../types/api";

export type CompanyDto = {
  id: string;
  name: string;
  cnpj: string;
};

// GET Companies com paginação
export async function getCompanies(pageSize: number = 10, pageNumber: number = 1) {
  const { data } = await axiosInstance.get<ApiResponsePagedDto<CompanyDto>[]>(
    apiEndpoint(`/api/Company/${pageSize}/${pageNumber}`)
  );

  // Normaliza: se vier array com um item, usa esse item; caso mude para objeto único, também funciona
  const normalized = Array.isArray(data)
    ? (data[0] ?? {
        totalRecords: 0, 
        pageSize,
        currentPage: pageNumber,
        totalPages: 0,
        hasSuccess: true,
        messageFriendly: "",
        messageTechnica: "",
        payload: [],
        statusCode: 200,
      })
    : (data as any);

  return normalized as ApiResponsePagedDto<CompanyDto>;
}

// POST Company
export async function createCompany(body: { name: string; cnpj: string }) {
  const { data } = await axiosInstance.post<ApiResponseDto<string>>(
    apiEndpoint("/api/Company"),
    body
  );
  return data;
}

// PUT Company
export async function updateCompany(id: string, body: { name: string; cnpj: string }) {
  const { data } = await axiosInstance.put<ApiResponseDto<string>>(
    apiEndpoint(`/api/Company/${id}`),
    body
  );
  return data;
}

// DELETE Company
export async function deleteCompany(id: string) {
  const { data } = await axiosInstance.delete<ApiResponseDto<{ deletedId: string }>>(
    apiEndpoint(`/api/Company/${id}`)
  );
  return data;
}
