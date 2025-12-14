// src/pages/HomePage.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Bem-vindo ao PsicoLive</h1>
      <p>
        Plataforma de videoconferência e análise emocional para psicólogos e clientes.
      </p>

      <nav style={{ marginTop: "20px" }}>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Cadastro</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/sessions">Gerenciar Sessões</Link>
          </li>
          <li>
            <Link to="/videoconferencia">Videoconferência</Link>
          </li>
          <li>
            <Link to="/recordings">Gravações</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
