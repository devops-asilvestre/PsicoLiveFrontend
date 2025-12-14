// src/pages/AgendaPsicologo.tsx
import React, { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from "../context/AuthContext";
import { createSlot, deleteSlot, getSlots, AgendaSlotDto } from "../api/agendaApi";

function toISODate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function makeDateTimeISO(dateISO: string, hour: number, minute: number) {
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(y, m - 1, d, hour, minute, 0, 0);
  return dt.toISOString();
}

const PERIODS = [
  { key: "morning", label: "Manhã", range: [8, 12] },
  { key: "afternoon", label: "Tarde", range: [13, 18] },
  { key: "night", label: "Noite", range: [19, 22] },
] as const;

const HOURS = [
  { h: 8, label: "08:00" }, { h: 9, label: "09:00" }, { h: 10, label: "10:00" }, { h: 11, label: "11:00" },
  { h: 12, label: "12:00" }, { h: 13, label: "13:00" }, { h: 14, label: "14:00" }, { h: 15, label: "15:00" },
  { h: 16, label: "16:00" }, { h: 17, label: "17:00" }, { h: 18, label: "18:00" }, { h: 19, label: "19:00" },
  { h: 20, label: "20:00" }, { h: 21, label: "21:00" }, { h: 22, label: "22:00" },
];

export default function AgendaPsicologo() {
  const { user, roles } = useAuth();
  const isPsicologo = roles.includes("PSICOLOGO");
  const psychologistId = user?.id || "";

  const [startDate, setStartDate] = useState(toISODate(new Date()));
  const [daysCount, setDaysCount] = useState(7);
  const [slots, setSlots] = useState<AgendaSlotDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedPeriod, setSelectedPeriod] = useState<typeof PERIODS[number]["key"]>("morning");
  const [selectedCells, setSelectedCells] = useState<Record<string, boolean>>({});

  const dates = useMemo(() => {
    const base = new Date(startDate);
    const arr: string[] = [];
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      arr.push(toISODate(d));
    }
    return arr;
  }, [startDate, daysCount]);

  useEffect(() => {
    if (!isPsicologo || !psychologistId) return;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const from = makeDateTimeISO(dates[0], 0, 0);
        const endBase = new Date(dates[dates.length - 1] + "T00:00:00");
        endBase.setHours(23, 59, 59, 999);
        const to = endBase.toISOString();
        const { payload } = await getSlots(psychologistId, from, to);
        setSlots(payload || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (dates.length > 0) load();
  }, [isPsicologo, psychologistId, dates]);

  function isHourInPeriod(hour: number, periodKey: typeof PERIODS[number]["key"]) {
    const p = PERIODS.find((x) => x.key === periodKey)!;
    return hour >= p.range[0] && hour < p.range[1];
  }

  async function handleToggleCell(dateISO: string, hour: number) {
    const key = `${dateISO}-${hour}`;
    const willSelect = !selectedCells[key];
    setSelectedCells((prev) => ({ ...prev, [key]: willSelect }));
  }

  async function handleCreateSelected() {
    try {
      setLoading(true);
      setError(null);
      const entries = Object.keys(selectedCells).filter((k) => selectedCells[k]);
      for (const k of entries) {
        const [dateISO, hourStr] = k.split("-");
        const hour = Number(hourStr);
        const startTime = makeDateTimeISO(dateISO, hour, 0);
        const endTime = makeDateTimeISO(dateISO, hour + 1, 0);
        const period: "morning" | "afternoon" | "night" =
          isHourInPeriod(hour, "morning") ? "morning" :
          isHourInPeriod(hour, "afternoon") ? "afternoon" :
          "night";

        const already = slots.some(s => s.date === dateISO && s.startTime === startTime && s.endTime === endTime);
        if (already) continue;

        await createSlot({ date: dateISO, startTime, endTime, period });
      }
      const from = makeDateTimeISO(dates[0], 0, 0);
      const endBase = new Date(dates[dates.length - 1] + "T00:00:00");
      endBase.setHours(23, 59, 59, 999);
      const to = endBase.toISOString();
      const { payload } = await getSlots(psychologistId, from, to);
      setSlots(payload || []);
      setSelectedCells({});
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSlot(id: string) {
    try {
      setLoading(true);
      setError(null);
      await deleteSlot(id);
      setSlots((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!isPsicologo) {
    return (
      <div className="container mt-3">
        <div className="alert alert-warning">Acesso restrito ao perfil PSICOLOGO.</div>
      </div>
    );
  }

  return (
    <div className="container mt-3">
      <h3>Agenda do Psicólogo</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-3">
        <div className="card-body">
          <form className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Data inicial</label>
              <input className="form-control" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Dias</label>
              <input className="form-control" type="number" min={1} max={30} value={daysCount} onChange={(e) => setDaysCount(Number(e.target.value))} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Período</label>
              <select className="form-select" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as any)}>
                {PERIODS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button type="button" className="btn btn-primary w-100" onClick={handleCreateSelected} disabled={loading}>
                Salvar disponibilidade
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered align-middle">
                    <thead className="table-light">
            <tr>
              <th>Data</th>
              {HOURS.map(h => (
                <th key={h.h} className="text-center" style={{ whiteSpace: "nowrap" }}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dates.map(dateISO => (
              <tr key={dateISO}>
                <td style={{ minWidth: 120 }}>
                  {new Date(dateISO + "T00:00:00-03:00").toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}
                </td>
                {HOURS.map(h => {
                  const inPeriod = isHourInPeriod(h.h, selectedPeriod);
                  const key = `${dateISO}-${h.h}`;
                  const existsSlot = slots.some(s => s.date === dateISO && new Date(s.startTime).getHours() === h.h);
                  return (
                    <td key={key} className="text-center">
                      {existsSlot ? (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => {
                            const slot = slots.find(
                              s => s.date === dateISO && new Date(s.startTime).getHours() === h.h
                            )!;
                            handleDeleteSlot(slot.id);
                          }}
                        >
                          Remover
                        </button>
                      ) : (
                        <div className="d-flex justify-content-center">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id={`chk-${key}`} 
                                aria-label={`Disponibilidade ${dateISO} ${h.label}`} 
                                disabled={!inPeriod || loading} 
                                checked={Boolean(selectedCells[key])} 
                                onChange={() => handleToggleCell(dateISO, h.h)} 
                            />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p className="text-muted">Processando...</p>}
    </div>
  );
}
