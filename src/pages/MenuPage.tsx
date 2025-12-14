// src/pages/MenuPage.tsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";

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

export default function MenuPage() {
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
    <div className="container mt-4">
      <h3>Menu ({currentRole})</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {menuItems.map((item) => (
          <div className="col-md-4 mb-3" key={item.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  <i className={`bi bi-${item.icon} me-2`}></i>
                  {item.title}
                </h5>
                <p className="text-muted">{item.route}</p>
                <a href={item.route} className="btn btn-outline-primary mt-auto">
                  Acessar
                </a>
              </div>
            </div>
          </div>
        ))}
        {menuItems.length === 0 && !error && (
          <p className="text-muted">Nenhum item disponível para este perfil.</p>
        )}
      </div>
    </div>
  );
}
