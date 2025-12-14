import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Agenda from "./pages/Agenda";
import Videoconferencia from "./pages/Videoconferencia";
import Configuracoes from "./pages/Configuracoes";

// Rota protegida
import ProtectedRoute from "./routes/ProtectedRoute";

// Import Bootstrap global
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["clinica", "psicologo", "paciente"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agenda"
            element={
              <ProtectedRoute allowedRoles={["clinica", "psicologo", "paciente"]}>
                <Agenda />
              </ProtectedRoute>
            }
          />

          <Route
            path="/videoconferencia"
            element={
              <ProtectedRoute allowedRoles={["psicologo", "paciente"]}>
                <Videoconferencia />
              </ProtectedRoute>
            }
          />

          <Route
            path="/configuracoes"
            element={
              <ProtectedRoute allowedRoles={["clinica"]}>
                <Configuracoes />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
