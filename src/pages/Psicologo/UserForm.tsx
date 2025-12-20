// src/pages/Psicologo/UserForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, updateUser, UserDto } from "../../api/userApi";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getCompanies, CompanyDto } from "../../api/companyApi";
import { DEFAULT_TWO_FACTOR_ENABLED } from "../../config/apiConfig";

export default function UserForm({ initial }: { initial?: UserDto | null }) {
  const navigate = useNavigate();
  const { isPsicologo, isAdmin } = useAuthUser();

  const [fullName, setFullName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(DEFAULT_TWO_FACTOR_ENABLED);
  const [lockoutEnabled, setLockoutEnabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  // estados para paginação e busca no modal
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (initial) {
      setFullName(initial.fullName);
      setEmail(initial.email);
      setUserName(initial.userName ?? "");
      setCompanyId(initial.companyId ?? "");
      setCompanyName(initial.companyName ?? "");
      setPhoneNumber(initial.phoneNumber ?? "");
      setTwoFactorEnabled(initial.twoFactorEnabled ?? DEFAULT_TWO_FACTOR_ENABLED);
      setLockoutEnabled(initial.lockoutEnabled ?? false);
    }
  }, [initial]);

  useEffect(() => {
    async function loadCompanies() {
      if (isAdmin) {
        const res = await getCompanies(pageSize, page);
        if (res.hasSuccess) {
          setCompanies(res.payload);
          setTotalPages(res.totalPages || 1);
        }
      }
    }
    loadCompanies();
  }, [isAdmin, page, pageSize]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const body = {
        fullName,
        companyId,
        userName,
        email,
        phoneNumber,
        twoFactorEnabled,
        lockoutEnabled
      };

      if (initial?.id) {
        const res = await updateUser(initial.id, body);
        if (!res.hasSuccess) throw new Error(res.messageFriendly || "Falha ao atualizar.");
      } else {
        const res = await createUser(body);
        if (!res.hasSuccess) throw new Error(res.messageFriendly || "Falha ao criar.");
      }

      if (isPsicologo) {
        navigate("/dashboard");
      } else {
        navigate("/psicologos");
      }
    } catch (e: any) {
      setError(e.message || "Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-4">
      <h3>{initial ? "Editar Psicólogo" : "Novo Psicólogo"}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Empresa vinculada */}
        {isAdmin ? (
          <div className="mb-3">
            <label className="form-label">Empresa</label>
            <div className="d-flex">
              <input className="form-control me-2" value={companyName} readOnly />
              <button type="button" className="btn btn-outline-primary" onClick={() => setShowCompanyModal(true)}>
                Selecionar
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label">Empresa</label>
            <input className="form-control" value={companyName} disabled />
          </div>
        )}

        {/* Nome */}
        <div className="mb-3">
          <label className="form-label">Nome completo</label>
          <input className="form-control" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        {/* Usuário */}
        <div className="mb-3">
          <label className="form-label">Usuário</label>
          <input className="form-control" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Telefone */}
        <div className="mb-3">
          <label className="form-label">Telefone</label>
          <input className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>

        {/* Autenticação em dois fatores - apenas ADMIN */}
        {isAdmin && (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            />
            <label className="form-check-label">Autenticação em dois fatores</label>
          </div>
        )}

        {/* Bloqueio habilitado - apenas ADMIN */}
        {isAdmin && (
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              checked={lockoutEnabled}
              onChange={(e) => setLockoutEnabled(e.target.checked)}
            />
            <label className="form-check-label">Bloqueio habilitado</label>
          </div>
        )}

        <div className="d-flex justify-content-between mt-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (isPsicologo) {
                navigate("/dashboard");
              } else {
                navigate("/psicologos");
              }
            }}
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {initial ? "Salvar alterações" : "Adicionar"}
          </button>
        </div>
      </form>

      {/* Modal de seleção de empresa */}
      {showCompanyModal && (
        <div className="modal d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Selecionar Empresa</h5>
                <button type="button" className="btn-close" onClick={() => setShowCompanyModal(false)}></button>
              </div>
              <div className="modal-body">
                {/* Campo de busca + seleção de pageSize */}
                <div className="mb-3 d-flex justify-content-between">
                  <input
                    type="text"
                    className="form-control w-50"
                    placeholder="Buscar por nome ou CNPJ..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {/*
                  <div className="d-flex align-items-center">
                    <label className="me-2">Registros por página:</label>
                    <select
                      className="form-select w-auto"
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div> */}
                </div>

                {/* Tabela de empresas */}
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>CNPJ</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies
                      .filter((c) =>
                        search
                          ? c.name.toLowerCase().includes(search.toLowerCase()) ||
                            c.cnpj.toLowerCase().includes(search.toLowerCase())
                          : true
                      )
                      .map((c) => (
                        <tr key={c.id}>
                          <td>{c.name}</td>
                          <td>{c.cnpj}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => {
                                setCompanyId(c.id);
                                setCompanyName(c.name);
                                setShowCompanyModal(false);
                              }}
                            >
                              Selecionar
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Paginação compacta */}
                <nav aria-label="Navegação de página">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setPage(page - 1)}>
                        Anterior
                      </button>
                    </li>

                    {(() => {
                      const blockSize = 5;
                      const currentBlock = Math.floor((page - 1) / blockSize);
                      const startPage = currentBlock * blockSize + 1;
                      const endPage = Math.min(startPage + blockSize - 1, totalPages);

                      const pages = [];
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(i)}>
                              {i}
                            </button>
                          </li>
                        );
                      }

                      return (
                        <>
                          {/* botão para voltar blocos */}
                          {startPage > 1 && (
                            <li className="page-item">
                              <button className="page-link" onClick={() => setPage(startPage - 1)}>
                                ...
                              </button>
                            </li>
                          )}
                          {pages}
                          {/* botão para avançar blocos */}
                          {endPage < totalPages && (
                            <li className="page-item">
                              <button className="page-link" onClick={() => setPage(endPage + 1)}>
                                ...
                              </button>
                            </li>
                          )}
                        </>
                      );
                    })()}

                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setPage(page + 1)}>
                        Próximo
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCompanyModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
