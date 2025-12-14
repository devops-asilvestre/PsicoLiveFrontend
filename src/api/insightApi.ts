// src/api/insightApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";

const INSIGHT_API = apiEndpoint("/api/insight");

export type ApiResponseDto<T = any> = {
  hasSuccess: boolean;
  messageFriendly?: string;
  messageTechnica?: string;
  payload: T;
  statusCode: number;
};

export type InsightAddDto = {
  sessionId: string;
  alegria: number;
  tristeza: number;
  medo: number;
  nojo: number;
  surpresa: number;
  raiva: number;
  ansiedade: number;
  voiceEnergy: number;
  attentionLevel?: string | null;
  posture?: string | null;
  engagement?: string | null;
  summary?: string | null;
};

export type InsightUpdateDto = InsightAddDto & { id: string };

export type InsightDto = InsightUpdateDto & { timestamp: string };

export async function getInsightsBySession(sessionId: string): Promise<ApiResponseDto<InsightDto[]>> {
  const { data } = await axiosInstance.get<ApiResponseDto<InsightDto[]>>(
    `${INSIGHT_API}/session/${sessionId}`
  );
  return data;
}

export async function createInsight(payload: InsightAddDto): Promise<ApiResponseDto<InsightDto>> {
  const { data } = await axiosInstance.post<ApiResponseDto<InsightDto>>(INSIGHT_API, payload);
  return data;
}

export async function updateInsight(id: string, payload: InsightUpdateDto): Promise<ApiResponseDto<InsightDto>> {
  if (id !== payload.id) {
    throw new Error("Id inconsistente: o parâmetro 'id' deve ser igual ao 'payload.id'.");
  }
  const { data } = await axiosInstance.put<ApiResponseDto<InsightDto>>(`${INSIGHT_API}/${id}`, payload);
  return data;
}

export async function deleteInsight(id: string): Promise<ApiResponseDto<null>> {
  const { data } = await axiosInstance.delete<ApiResponseDto<null>>(`${INSIGHT_API}/${id}`);
  return data;
}
