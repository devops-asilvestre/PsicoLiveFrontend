// src/api/agendaApi.ts
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";

export type AgendaSlotDto = {
  id: string;
  date: string;       // ISO (yyyy-mm-dd)
  startTime: string;  // ISO datetime
  endTime: string;    // ISO datetime
  period: "morning" | "afternoon" | "night";
};

export type ApiResponseDto<T> = {
  hasSuccess: boolean;
  messageFriendly: string;
  messageTechnica: string;
  payload: T;
  statusCode: number;
};

export async function createSlot(body: {
  date: string;
  startTime: string;
  endTime: string;
  period: "morning" | "afternoon" | "night";
}) {
  const { data } = await axiosInstance.post<ApiResponseDto<AgendaSlotDto>>(apiEndpoint("/api/Agenda"), body);
  return data;
}

export async function getSlots(psychologistId: string, fromIso: string, toIso: string) {
  const { data } = await axiosInstance.get<ApiResponseDto<AgendaSlotDto[]>>(
    apiEndpoint(`/api/Agenda/${psychologistId}?from=${encodeURIComponent(fromIso)}&to=${encodeURIComponent(toIso)}`)
  );
  return data;
}

export async function deleteSlot(agendaId: string) {
  const { data } = await axiosInstance.delete<ApiResponseDto<{ deletedId: string }>>(
    apiEndpoint(`/api/Agenda/${agendaId}`)
  );
  return data;
}
