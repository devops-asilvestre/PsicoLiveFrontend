// srv/pages/User/UserList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserDto, getUsers, deleteUser } from "../../api/userApi";
import { useAuthUser } from "../../hooks/useAuthUser";

// Tipos de ordenação multipla
type SortConfig = { column: "fullName" | "email"; direction: "asc" | "desc" };

export default function UserList() {
    const {isAdmin } = useAuthUser();
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError]= useState<string | null>(null);

    // Paginação, busca e ordenação multipla
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [sortConfigs, setSortConfigs] = useState<SortConfig[]>([]);

async function loadUsers(){
    try {
        setLoading(true);
        setError(null);
        const res = await getUsers();
        if(res.hasSuccess){
            let data = res.payload || []

            // filtro de busca
            if(search.trim()){
                const term = search.toLowerCase();
                data = data.filter(c =>
                c.fullName.toLowerCase().includes(term) ||
                c.email.toLowerCase().includes(term)
                );
            }

            // ordenação multipla
            if(sortConfigs.length > 0){
                data = [...data].sort((a,b) =>{
                    for(const config of sortConfigs){
                        const valA = a[config.column].toLowerCase();
                        const valB = b[config.column].toLowerCase();
                        if(valA < valB) return config.direction === "asc" ? -1 : 1;
                        if(valA > valB) return config.direction === "asc" ? -1 : 1;
                    }
                    return 0;
                });
            }

            // paginação local
            const total = data.length;
            const totalPagesCalc = Math.ceil(total / pageSize) || 1;
            setTotalPages(totalPagesCalc);
            const start = (page -1) * pageSize;
            const end = start + pageSize;
            setUsers(data.slice(start, end));
        } else {
            setError(res.messageFriendly || "Falha ao listar usuarios");
        }
    } catch(e: any){
        setError(e.message || "Erro ao carregar usuarios");
    } finally {
        setLoading(false);
    }
}

useEffect(() =>{
    if(isAdmin) loadUsers();
}, [isAdmin, page, pageSize, search, sortConfigs]);

function handleSort(column: "fullname" | "email"){
    setSortConfigs(prev => {
      const existing = prev.find(sc => sc.column === column);
      if(existing){
        // alterna direção
        const newDirection = existing.direction === "asc" ? "desc" : "asc";
        return prev.map(sc => 
            sc.column === column ? { ...sc, direction : newDirection } : sc
        );
      } else {
        // adiciona novo critério ao final
        return [...prev, {column, direction: "asc" }];
      }
    });
    setPage(1);
}

function getSortIndicator(column: "fullname" | "email") {
    const config = sortConfigs.find(sc => sc.column === column);
    if (!config) return "";
    return config.direction === "asc" ? "▲" : "▼";
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
          <h3>Psicólogos</h3>
          <button className="btn btn-success" onClick={() => navigate("/psicologos/new")}>
            <i className="bi bi-plus-circle"></i> Novo Registro
          </button>
        </div>
  
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
  
        {/* Campo de busca + seleção de pageSize */}
        <div className="mb-3 d-flex justify-content-between">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Buscar por nome ou email..."
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
                  onClick={() => handleSort("fullname")}
                  style={{ cursor: "pointer" }}
                >
                  Nome {getSortIndicator("email")}
                </th>
                <th
                  onClick={() => handleSort("email")}
                  style={{ cursor: "pointer" }}
                >
                  eMail {getSortIndicator("email")}
                </th>
                <th style={{ width: 120 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map(c => (
                <tr key={c.id}>
                  <td>{c.fullName}</td>
                  <td>{c.email}</td>
                  <td>
                    <div className="btn-group" role="group" aria-label="Ações">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                        onClick={() => navigate(`/psicologos/${c.id}/edit`)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Excluir"
                        onClick={async () => {
                          if (!window.confirm(`Excluir usuário "${c.fullName}"?`)) return;
                          try {
                            setLoading(true);
                            const res = await deleteUser(c.id);
                            if (!res.hasSuccess) {
                              setError(res.messageFriendly || "Falha ao excluir.");
                            }
                            await loadUsers();
                          } catch (e: any) {
                            setError(e.message || "Erro ao excluir.");
                          } finally {
                            setLoading(false);
                          }
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && !loading && (
                <tr>
                  <td colSpan={3} className="text-center text-muted">Nenhum Psicólogo encontrada.</td>
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
  