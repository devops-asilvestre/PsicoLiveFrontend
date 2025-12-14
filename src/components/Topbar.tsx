// src/components/Topbar.tsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-3 d-flex justify-content-between">
      {/* Botão de menu lateral (mobile) */}
      <button className="btn btn-outline-primary d-md-none" onClick={onMenuClick}>
        ☰ Menu
      </button>

      {/* Título ou logo */}
      <span className="navbar-brand mb-0 h1">Painel Administrativo</span>

      {/* Perfil do usuário */}
      <div className="dropdown">
        <button
          className="btn d-flex align-items-center"
          onClick={toggleDropdown}
          style={{ border: "none", background: "none" }}
        >
          <img
            src="https://via.placeholder.com/40x40.png?text=U"
            alt="Avatar"
            className="rounded-circle me-2"
            width={40}
            height={40}
          />
          <span className="d-none d-md-inline">{user?.fullName || "Usuário"}</span>
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu dropdown-menu-end show mt-2" style={{ position: "absolute", right: 10 }}>
            <button className="dropdown-item">Editar Perfil</button>
            <button className="dropdown-item">Mensagens Internas</button>
            <button className="dropdown-item">Configurações</button>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item text-danger" onClick={logout}>
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
