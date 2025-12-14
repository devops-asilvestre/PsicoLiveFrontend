// src/pages/RecordingsPage.tsx
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../config/axiosConfig";
import { apiEndpoint } from "../config/apiConfig";

const RECORDING_API = apiEndpoint("/api/recording");

type RecordingDto = {
  id: string;
  sessionId: string;
  storageUri: string;
  format: string;
  size: number;
  createdAt: string;
};

export default function RecordingsPage({ sessionId }: { sessionId: string }) {
  const [recordings, setRecordings] = useState<RecordingDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecordings() {
      try {
        const { data } = await axiosInstance.get<{ payload: RecordingDto[] }>(
          `${RECORDING_API}/session/${sessionId}`
        );
        setRecordings(data.payload);
      } catch (err: any) {
        setError(err.message);
      }
    }
    fetchRecordings();
  }, [sessionId]);

  return (
    <>
      <h2>Gravações da Sessão</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {recordings.map((r) => (
          <li key={r.id}>
            <a href={r.storageUri} target="_blank" rel="noopener noreferrer">
              {r.format} - {Math.round(r.size / 1024)} KB
            </a>{" "}
            ({new Date(r.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </>
  );
}
