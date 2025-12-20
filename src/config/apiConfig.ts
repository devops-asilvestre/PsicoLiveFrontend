// src/config/apiConfig.ts
export const API_BASE_URL = "https://localhost:2359";

export function apiEndpoint(path: string) {
  return `${API_BASE_URL}${path}`;
}

// Valor default para autenticação em dois fatores
export const DEFAULT_TWO_FACTOR_ENABLED = true;
