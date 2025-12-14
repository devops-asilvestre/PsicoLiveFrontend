// src/api/sessionApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";

const API_URL = apiEndpoint("/api/session");

export type ApiResponseDto<T = any> = {
  hasSuccess: boolean;
  messageFriendly?: string;
  messageTechnica?: string;
  payload: T;
  statusCode: number;
};

function isGuid(value: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value ?? "");
}

export async function createSession(
  psychologistId: string,
  psychologistName: string,
  clientId: string,
  clientName: string,
  scheduledAt?: Date,
  behavioralSummary?: string | null,
  roomName?: string | null
): Promise<ApiResponseDto> {
  if (!isGuid(psychologistId)) throw new Error("psychologistId inválido: GUID necessário.");
  if (!isGuid(clientId)) throw new Error("clientId inválido: GUID necessário.");
  if (!psychologistName?.trim()) throw new Error("psychologistName é obrigatório.");
  if (!clientName?.trim()) throw new Error("clientName é obrigatório.");

  const payload = {
    psychologistId,
    psychologistName: psychologistName.trim(),
    clientId,
    clientName: clientName.trim(),
    scheduledAt: (scheduledAt ?? new Date()).toISOString(),
    behavioralSummary: behavioralSummary ?? null,
    roomName: roomName ?? null,
  };

  const { data } = await axiosInstance.post<ApiResponseDto>(API_URL, payload);
  return data;
}

export async function getSession(id: string): Promise<ApiResponseDto> {
  const { data } = await axiosInstance.get<ApiResponseDto>(`${API_URL}/${id}`);
  return data;
}

export async function updateSessionStatus(id: string, status: number): Promise<ApiResponseDto> {
  const { data } = await axiosInstance.patch<ApiResponseDto>(`${API_URL}/${id}/status`, status);
  return data;
}

export async function updateBehavioralSummary(id: string, summary: string): Promise<ApiResponseDto> {
  const { data } = await axiosInstance.patch<ApiResponseDto>(`${API_URL}/${id}/summary`, summary);
  return data;
}
