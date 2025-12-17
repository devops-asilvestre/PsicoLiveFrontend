// src/hooks/useAuthUser.ts
import { useAuth } from "../context/AuthContext";

export function useAuthUser() {
  const { user, roles, token } = useAuth();

  return {
    id: user?.id ?? "",
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    roles,
    token,
    isAdmin: roles.includes("ADMIN"),
    isPsicologo: roles.includes("PSICOLOGO"),
    isAuthenticated: !!token
  };
}
