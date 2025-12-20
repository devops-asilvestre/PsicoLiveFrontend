// src/pages/Psicologo/UserPage.tsx
import React, { useEffect, useState } from "react";
import { useAuthUser } from "../../hooks/useAuthUser";
import UserList from "./UserList";
import UserForm from "./UserForm";
import { getUsers, UserDto } from "../../api/userApi";

export default function UserPage() {
  const { isAdmin, isPsicologo, id } = useAuthUser();
  const [userData, setUserData] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (isPsicologo && id) {
        setLoading(true);
        try {
          // Carrega apenas os dados do psicólogo logado
          const res = await getUsers();
          const found = res.payload.find(u => u.id === id);
          if (found) setUserData(found);
        } finally {
          setLoading(false);
        }
      }
    }
    loadUser();
  }, [isPsicologo, id]);

  if (isAdmin) {
    return <UserList />;
  }

  if (isPsicologo) {
    if (loading) {
      return <p className="text-muted">Carregando dados do seu perfil...</p>;
    }
    return <UserForm initial={userData} />;
  }

  return (
    <div className="container mt-3">
      <div className="alert alert-warning">Acesso não autorizado.</div>
    </div>
  );
}
