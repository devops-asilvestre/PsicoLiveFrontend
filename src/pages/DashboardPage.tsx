// src/pages/DashboardPage.tsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [startDate, setStartDate] = useState("2025-12-02");
  const [endDate, setEndDate] = useState("2025-12-09");

  const chartData = {
    labels: ["Sep 23", "Oct 10", "Oct 25", "Nov 5", "Nov 20", "Dec 9"],
    datasets: [
      {
        label: "Unique Visitors",
        data: [120, 180, 150, 200, 250, 300],
        borderColor: "#007bff",
        backgroundColor: "rgba(0,123,255,0.2)",
      },
      {
        label: "Page Views",
        data: [300, 400, 380, 420, 500, 550],
        borderColor: "#28a745",
        backgroundColor: "rgba(40,167,69,0.2)",
      },
    ],
  };

  return (
    <>
      <h2 className="mb-4">Dashboard</h2>

      {/* Seletor de período */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label>Data inicial:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label>Data final:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Total de Vendas</h5>
              <p>$64,559.25</p>
              <small className="text-success">▲ 33.21% vs semana anterior</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Taxa de Conversão</h5>
              <p>2.19%</p>
              <small className="text-danger">▼ 0.50% vs semana anterior</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Sessões</h5>
              <p>70,719</p>
              <small className="text-success">▲ 9.5%</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Visitantes</h5>
              <p>127.1K novos / 179.9K recorrentes</p>
              <small className="text-success">▲ 25.5% / ▼ 5.33%</small>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Tráfego por período</h5>
          <Line data={chartData} />
        </div>
      </div>
    </>
  );
}
