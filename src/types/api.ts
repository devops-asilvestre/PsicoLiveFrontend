// src/types/api.ts

// Resposta genérica da API
export type ApiResponseDto<T> = {
  hasSuccess: boolean;
  messageFriendly: string;
  messageTechnica: string;
  payload: T;
  statusCode: number;
};

// Resposta paginada da API
export type ApiResponsePagedDto<T> = {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasSuccess: boolean;
  messageFriendly: string;
  messageTechnica: string;
  payload: T[];
  statusCode: number;
};
