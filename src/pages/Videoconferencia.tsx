// src/pages/Videoconferencia.tsx
import React, { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { axiosInstance } from "../config/axiosConfig";
import { API_BASE_URL, apiEndpoint } from "../config/apiConfig";
import { useAuth } from "../context/AuthContext";

type InsightPayload = {
  alegria: number;
  tristeza: number;
  medo: number;
  nojo: number;
  surpresa: number;
  raiva: number;
  ansiedade: number;
  voiceEnergy: number;
  attentionLevel: number;
  posture: number;
};

export default function Videoconferencia({
  clientId,
  clientName,
}: {
  clientId: string;
  clientName: string;
}) {
  const { user, roles } = useAuth();
  const profile = roles[0] || "CLIENTE"; // ADMIN | PSICOLOGO | CLIENTE
  const psychologistId = profile === "PSICOLOGO" ? user?.id || "" : "";
  const psychologistName = profile === "PSICOLOGO" ? user?.fullName || "" : "";
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [insights, setInsights] = useState<InsightPayload | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 1. Habilitar áudio e vídeo
  useEffect(() => {
    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        // Futuro: WebRTC para preencher remoteVideoRef
      } catch (err) {
        console.error("Erro ao acessar mídia:", err);
      }
    }
    initMedia();
  }, []);

  // 4. Criar Session e Room automaticamente
  useEffect(() => {
    async function createSessionAndRoom() {
      try {
        const resp = await axiosInstance.post(apiEndpoint("/api/Session"), {
          psychologistId,
          psychologistName,
          clientId,
          clientName,
          scheduledAt: new Date().toISOString(),
          behavioralSummary: null,
          roomName: null,
        }, { headers: { "Content-Type": "application/json" } });

        const newSessionId = resp.data?.payload;
        setSessionId(newSessionId);

        if (newSessionId) {
          await axiosInstance.post(apiEndpoint("/api/Room"), {
            roomCode: `ROOM-${newSessionId}`,
            name: `Sala ${newSessionId}`,
            sessionId: newSessionId,
          }, { headers: { "Content-Type": "application/json" } });
        }
      } catch (err) {
        console.error("Erro ao criar sessão/room:", err);
      }
    }
    createSessionAndRoom();
  }, [psychologistId, psychologistName, clientId, clientName]);

  // 3. Conectar InsightsHub
  useEffect(() => {
    if (!sessionId) return;
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/insights`, {
        accessTokenFactory: () => localStorage.getItem("authToken") || "",
      })
      .withAutomaticReconnect()
      .build();

    connection.start().then(() => connection.invoke("JoinSession", sessionId));
    connection.on("InsightUpdate", (payload: InsightPayload) => setInsights(payload));

    return () => void connection.stop();
  }, [sessionId]);

  return (
    <div className="container-fluid mt-3">
      <h2>Videoconferência</h2>

      {/* 2.4 Dados do Psicólogo e Paciente */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>Dados do Psicólogo</h5>
            <p><strong>ID:</strong> {psychologistId || "—"}</p>
            <p><strong>Nome:</strong> {psychologistName || "—"}</p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5>Dados do Paciente</h5>
            <p><strong>ID:</strong> {clientId}</p>
            <p><strong>Nome:</strong> {clientName}</p>
          </div>
        </div>
      </div>

      <div className="row">
        {/* 2.2 Caixa maior: remoto (esquerda) */}
        <div className="col-md-9">
          <div className="card shadow-sm mb-3">
            <div className="card-body text-center">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-100" style={{ height: "500px", backgroundColor: "#000" }} />
            </div>
          </div>

          {/* 2.3 InsightsPanel somente para PSICOLOGO */}
          {profile === "PSICOLOGO" && (
            <div className="card shadow-sm p-3">
              <h5>Insights em tempo real</h5>
              <div className="row">
                {[
                  "alegria", "tristeza", "medo", "nojo", "surpresa",
                  "raiva", "ansiedade", "voiceEnergy", "attentionLevel", "posture",
                ].map((key) => (
                  <div className="col-md-2 mb-3" key={key}>
                    <div className="border rounded p-2 text-center bg-light">
                      <strong>{key}</strong>
                      <p className="mb-0">{(insights as any)?.[key] ?? "—"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2.1 Caixa menor: local (direita) */}
        <div className="col-md-3">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-100" style={{ height: "200px", backgroundColor: "#000" }} />
              <p className="mt-2">Sua câmera</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
