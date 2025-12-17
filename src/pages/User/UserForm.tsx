// src/pages/User/UserForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, updateUser, getUsers, UserDto } from "../../api/userApi";


export default function UserForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [fullName, setfullName] = useState("");
  const [eMail, seteMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (id) {
        const res = await getUsers();
        const User = res.payload.find((c: UserDto) => c.id === id);
        if (User) {
          setfullName(User.fullName);
          seteMail(User.email);
        }
      }
    }
    loadUser();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) { setError("Informe o nome."); return; }
    if (!eMail.trim()) { setError("Informe o eMail."); return; }

    //const onlyDigits = cnpj.replace(/\D/g, "");
    //if (onlyDigits.length !== 14) { setError("CNPJ deve conter 14 dígitos."); return; }

    try {
      setLoading(true);
      if (id) {
        const res = await updateUser(id, { fullName: fullName.trim(), email: eMail.trim() });
        if (!res.hasSuccess) throw new Error(res.messageFriendly || "Falha ao editar.");
      } else {
        const res = await createUser({ fullName: fullName.trim(), email: eMail.trim() });
        if (!res.hasSuccess) throw new Error(res.messageFriendly || "Falha ao incluir.");
      }
      // após salvar, volta para a lista
      navigate("/psicologos");
    } catch (e: any) {
      setError(e.message || "Erro ao salvar empresa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h3>{id ? "Editar Psicólogo" : "Novo Psicólogo"}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="UserName">Nome</label>
          <input
            id="UserName"
            className="form-control"
            value={fullName}
            onChange={(e) => setfullName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="UserEmail">eMail</label>
          <input
            id="UserEmail"
            className="form-control"
            value={eMail}
            onChange={(e) => seteMail(e.target.value)}
          />
          <small className="text-muted">Somente números, com 14 dígitos.</small>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/psicologos")}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {id ? "Salvar alterações" : "Adicionar"}
          </button>
        </div>
      </form>
    </div>
  );
}
