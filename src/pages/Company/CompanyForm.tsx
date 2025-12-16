// src/pages/Company/CompanyForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createCompany, updateCompany, getCompanies, CompanyDto } from "../../api/companyApi";

export default function CompanyForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCompany() {
      if (id) {
        const res = await getCompanies();
        const company = res.payload.find((c: CompanyDto) => c.id === id);
        if (company) {
          setName(company.name);
          setCnpj(company.cnpj);
        }
      }
    }
    loadCompany();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError("Informe o nome."); return; }
    if (!cnpj.trim()) { setError("Informe o CNPJ."); return; }

    const onlyDigits = cnpj.replace(/\D/g, "");
    if (onlyDigits.length !== 14) { setError("CNPJ deve conter 14 dígitos."); return; }

    try {
      setLoading(true);
      if (id) {
        const res = await updateCompany(id, { name: name.trim(), cnpj: onlyDigits });
        if (!res.hasSuccess) throw new Error(res.messageFriendly || "Falha ao editar.");
      } else {
        const res = await createCompany({ name: name.trim(), cnpj: onlyDigits });
        if (!res.hasSuccess) throw new Error(res.messageFriendly || "Falha ao incluir.");
      }
      // após salvar, volta para a lista
      navigate("/company");
    } catch (e: any) {
      setError(e.message || "Erro ao salvar empresa.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h3>{id ? "Editar Empresa" : "Nova Empresa"}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="companyName">Nome</label>
          <input
            id="companyName"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="companyCnpj">CNPJ</label>
          <input
            id="companyCnpj"
            className="form-control"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
          />
          <small className="text-muted">Somente números, com 14 dígitos.</small>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/company")}
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
