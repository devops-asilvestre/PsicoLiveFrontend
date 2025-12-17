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

import CompanyList from "./pages/Company/CompanyList";
import CompanyForm from "./pages/Company/CompanyForm";

import UserList from "./pages/User/UserList";
import UserForm from "./pages/User/UserForm";

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
          <Route
            path="/psicologos"
            element={
              <ProtectedRoute role="ADMIN">
                <MasterPage>
                  <UserList />
                </MasterPage>
              </ProtectedRoute>
            }
          />
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
