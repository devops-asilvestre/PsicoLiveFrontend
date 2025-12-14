// src/pages/SessionPage.tsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";

type Patient = { id: string; name: string; email?: string };

export default function SessionPage() {
  const { user } = useAuth();
  const psychologistId = user?.id || "";
  const psychologistName = user?.fullName || "";
  const [patients, setPatients] = useState<Patient[]>([]);
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const { data } = await axiosInstance.get<Patient[]>(apiEndpoint("/api/Patients"));
        setPatients(data);
      } catch {
        setPatients([]);
      }
    }
    fetchPatients();
  }, []);

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const payload = {
        psychologistId,
        psychologistName,
        clientId,
        clientName,
        scheduledAt,
        behavioralSummary: null,
        roomName: null,
      };
      const { data } = await axiosInstance.post(apiEndpoint("/api/Session"), payload, {
        headers: { "Content-Type": "application/json" },
      });
      const sessionId = data?.payload;
      if (sessionId) {
        await axiosInstance.post(apiEndpoint("/api/Room"), {
          roomCode: `ROOM-${sessionId}`,
          name: `Sala ${sessionId}`,
          sessionId,
        });
        setMessage(`Sessão criada com sucesso. SessionId: ${sessionId}`);
      } else {
        setMessage("Sessão criada, mas nenhum SessionId foi retornado em payload.");
      }
    } catch (err: any) {
      setError(err?.message || "Erro ao criar sessão");
    }
  }

  return (
    <div className="container mt-3">
      <h3>Agendar Sessão</h3>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleCreateSession} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Paciente</label>
          <select className="form-select" value={clientId} onChange={(e) => {
            const id = e.target.value;
            setClientId(id);
            const found = patients.find(p => p.id === id);
            setClientName(found?.name || "");
          }} required>
            <option value="">Selecione...</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Data e hora</label>
          <input type="datetime-local" className="form-control" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} required />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Criar sessão</button>
        </div>
      </form>
    </div>
  );
}
