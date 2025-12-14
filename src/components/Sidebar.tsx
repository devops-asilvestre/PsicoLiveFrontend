// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo/logomarca.png";

type SidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  route: string;
  parentId: string | null;
};

type MenuResponse = {
  hasSuccess: boolean;
  messageFriendly: string;
  messageTechnica: string;
  payload: MenuItem[];
  statusCode: number;
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { roles } = useAuth();
  const currentRole = roles[0]?.toLowerCase() || "cliente";
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const { data } = await axiosInstance.get<MenuResponse>(
          apiEndpoint(`/api/Menu/role/${currentRole}`)
        );
        if (data.hasSuccess && Array.isArray(data.payload)) {
          setMenuItems(data.payload);
        } else {
          setError(data.messageFriendly || "Erro ao carregar menu.");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao buscar menu.");
      }
    }
    fetchMenu();
  }, [currentRole]);

  return (
    <div
      className={`bg-dark text-white p-3 sidebar ${mobileOpen ? "d-block" : "d-none d-md-block"}`}
      style={{ width: "250px", minHeight: "100vh" }}
    >
      {/* Logo da aplicação */}
      <div className="text-center mb-3">
        <img
          src={logo}
          alt="Logo PsicoLive"
          style={{
            maxWidth: "140px",
            height: "auto",
            borderRadius: "8px",
          }}
        />
      </div>

      {/* Separador */}
      <hr className="border-secondary" />

      {/* Título de navegação */}
      <h6 className="text-uppercase text-muted mb-3">Navigation</h6>

      {/* Menu dinâmico */}
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav flex-column">
        {menuItems.map((item) => (
          <li className="nav-item" key={item.id}>
            <Link to={item.route} className="nav-link text-white">
              <i className={`bi bi-${item.icon} me-2`}></i>
              {item.title}
            </Link>
          </li>
        ))}
        {menuItems.length === 0 && !error && (
          <li className="nav-item text-muted">Nenhum item disponível.</li>
        )}
      </ul>

      {/* Botão para fechar menu no mobile */}
      <button className="btn btn-outline-light mt-4 d-md-none" onClick={onClose}>
        Fechar menu
      </button>
    </div>
  );
}
