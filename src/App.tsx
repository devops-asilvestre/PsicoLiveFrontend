// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // caso exista
import DashboardPage from "./pages/DashboardPage"; // seu dashboard atual
import MenuPage from "./pages/MenuPage";
import AgendaPsicologo from "./pages/AgendaPsicologo";
import SessionPage from "./pages/SessionPage";
import Videoconferencia from "./pages/Videoconferencia";

import MasterPage from "./layout/MasterPage"; // seu layout existente
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Público */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Área autenticada dentro do MasterPage */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MasterPage>
                  <DashboardPage />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MasterPage>
                  <MenuPage />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agenda"
            element={
              <ProtectedRoute>
                <MasterPage>
                  <AgendaPsicologo />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/session"
            element={
              <ProtectedRoute>
                <MasterPage>
                  <SessionPage />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/videoconferencia"
            element={
              <ProtectedRoute>
                <MasterPage>
                  <Videoconferencia clientId="CLIENT-EXEMPLO" clientName="Paciente Exemplo" />
                </MasterPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
