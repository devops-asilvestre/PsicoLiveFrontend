// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import { registerUser } from "../api/authApi";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleName, setRoleName] = useState<"Admin" | "Psicologo" | "Cliente">("Cliente");
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      const resp = await registerUser({ fullName, email, password, roleName, companyId });
      if (resp.hasSuccess) {
        alert("Usuário registrado com sucesso!");
        window.location.href = "/login";
      } else {
        setError(resp.messageFriendly ?? "Erro ao registrar usuário");
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2>Cadastro</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Nome completo:</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Função:</label>
          <select value={roleName} onChange={(e) => setRoleName(e.target.value as any)}>
            <option value="Cliente">Cliente</option>
            <option value="Psicologo">Psicólogo</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div>
          <label>Empresa (CompanyId):</label>
          <input type="text" value={companyId} onChange={(e) => setCompanyId(e.target.value)} required />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}
