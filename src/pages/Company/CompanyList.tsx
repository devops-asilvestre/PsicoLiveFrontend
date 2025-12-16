// src/pages/Company/CompanyList.tsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../../context/AuthContext";
import { CompanyDto, getCompanies, deleteCompany } from "../../api/companyApi";
import { useNavigate } from "react-router-dom";

export default function CompanyList() {
  const { roles } = useAuth();
  const isAdmin = roles.includes("ADMIN");
  const navigate = useNavigate();

  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // paginação, busca e ordenação
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<"name" | "cnpj" | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  async function loadCompanies() {
    try {
      setLoading(true);
      setError(null);
      const res = await getCompanies();
      if (res.hasSuccess) {
        let data = res.payload || [];

        // filtro de busca
        if (search.trim()) {
          const term = search.toLowerCase();
          data = data.filter(c =>
            c.name.toLowerCase().includes(term) ||
            c.cnpj.toLowerCase().includes(term)
          );
        }

        // ordenação
        if (sortColumn) {
          data = [...data].sort((a, b) => {
            const valA = a[sortColumn].toLowerCase();
            const valB = b[sortColumn].toLowerCase();
            if (valA < valB) return sortDirection === "asc" ? -1 : 1;
            if (valA > valB) return sortDirection === "asc" ? 1 : -1;
            return 0;
          });
        }

        // paginação local
        const total = data.length;
        const totalPagesCalc = Math.ceil(total / pageSize) || 1;
        setTotalPages(totalPagesCalc);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setCompanies(data.slice(start, end));
      } else {
        setError(res.messageFriendly || "Falha ao listar empresas.");
      }
    } catch (e: any) {
      setError(e.message || "Erro ao carregar empresas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isAdmin) loadCompanies();
  }, [isAdmin, page, pageSize, search, sortColumn, sortDirection]);

  function handleSort(column: "name" | "cnpj") {
    if (sortColumn === column) {
      // alterna direção
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
    setPage(1); // volta para primeira página
  }

  if (!isAdmin) {
    return (
      <div className="container mt-3">
        <div className="alert alert-warning">Acesso restrito ao perfil ADMIN.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Companies</h3>
        <button className="btn btn-success" onClick={() => navigate("/companies/new")}>
          Novo Registro
        </button>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {/* Campo de busca + seleção de pageSize */}
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por nome ou CNPJ..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <div className="d-flex align-items-center">
          <label className="me-2">Registros por página:</label>
          <select
            className="form-select w-auto"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table id="myTable" className="table table-striped">
          <thead>
            <tr>
              <th
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                Nome {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th
                onClick={() => handleSort("cnpj")}
                style={{ cursor: "pointer" }}
              >
                CNPJ {sortColumn === "cnpj" && (sortDirection === "asc" ? "▲" : "▼")}
              </th>
              <th style={{ width: 220 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.cnpj}</td>
                <td>
                  <div className="btn-group" role="group" aria-label="Ações">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/companies/${c.id}/edit`)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        if (!window.confirm(`Excluir empresa "${c.name}"?`)) return;
                        try {
                          setLoading(true);
                          const res = await deleteCompany(c.id);
                          if (!res.hasSuccess) {
                            setError(res.messageFriendly || "Falha ao excluir.");
                          }
                          await loadCompanies();
                        } catch (e: any) {
                          setError(e.message || "Erro ao excluir.");
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {companies.length === 0 && !loading && (
              <tr>
                <td colSpan={3} className="text-center text-muted">Nenhuma empresa encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <nav aria-label="Navegação de página">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page - 1)}>Anterior</button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setPage(page + 1)}>Próximo</button>
          </li>
        </ul>
      </nav>

      {loading && <p className="text-muted">Processando...</p>}
    </div>
  );
}
