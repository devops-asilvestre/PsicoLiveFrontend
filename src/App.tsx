// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"; // caso exista
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import AgendaPsicologo from "./pages/AgendaPsicologo";
import SessionPage from "./pages/SessionPage";
import Videoconferencia from "./pages/Videoconferencia";

import CompanyList from "./pages/Company/CompanyList";
import CompanyForm from "./pages/Company/CompanyForm";

import UserList from "./pages/Psicologo/UserList";
import UserForm from "./pages/Psicologo/UserForm";
import UserPage from "./pages/Psicologo/UserPage"; // novo componente inteligente

import MasterPage from "./layout/MasterPage";
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

          {/* Companies */}
          <Route
            path="/company"
            element={
              <ProtectedRoute role="ADMIN">
                <MasterPage>
                  <CompanyList />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/new"
            element={
              <ProtectedRoute role="ADMIN">
                <MasterPage>
                  <CompanyForm />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies/:id/edit"
            element={
              <ProtectedRoute role="ADMIN">
                <MasterPage>
                  <CompanyForm />
                </MasterPage>
              </ProtectedRoute>
            }
          />

          {/* Users (ADMIN vê lista, PSICOLOGO vê seu próprio formulário) */}
          <Route
            path="/psicologos"
            element={
              <ProtectedRoute role="ADMIN,PSICOLOGO">
                <MasterPage>
                  <UserPage />
                </MasterPage>
              </ProtectedRoute>
            }
          />

          {/* Rotas específicas para ADMIN */}
          <Route
            path="/psicologos/new"
            element={
              <ProtectedRoute role="ADMIN">
                <MasterPage>
                  <UserForm />
                </MasterPage>
              </ProtectedRoute>
            }
          />
          <Route
            path="/psicologos/:id/edit"
            element={
              <ProtectedRoute role="ADMIN">
                <MasterPage>
                  <UserForm />
                </MasterPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
