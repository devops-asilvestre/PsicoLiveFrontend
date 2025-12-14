import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { createInsightsConnection } from "../services/signalRService";

type Insight = {
  timestamp: string;
  alegria: number;
  tristeza: number;
  ansiedade: number;
  voiceEnergy: number;
  attentionLevel?: string;
  posture?: string;
  engagement?: string;
  summary?: string;
};

type Props = {
  sessionId: string;
};

const InsightsPanel: React.FC<Props> = ({ sessionId }) => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const conn = createInsightsConnection(sessionId, (payload: Insight) => {
      setInsights((prev) => [...prev, payload]);
    });
    return () => conn.stop();
  }, [sessionId]);

  useEffect(() => {
    if (insights.length === 0) return;

    const categories = insights.map((i) => new Date(i.timestamp).toLocaleTimeString());
    const emotionsOptions = {
      chart: { type: "line", height: 250 },
      series: [
        { name: "Alegria", data: insights.map((i) => i.alegria) },
        { name: "Tristeza", data: insights.map((i) => i.tristeza) },
        { name: "Ansiedade", data: insights.map((i) => i.ansiedade) },
      ],
      xaxis: { categories },
    };
    const emotionsChart = new ApexCharts(document.querySelector("#emotionsChart"), emotionsOptions);
    emotionsChart.render();

    const voiceOptions = {
      chart: { type: "bar", height: 250 },
      series: [{ name: "Energia da voz", data: insights.map((i) => i.voiceEnergy) }],
      xaxis: { categories },
    };
    const voiceChart = new ApexCharts(document.querySelector("#voiceChart"), voiceOptions);
    voiceChart.render();

    return () => {
      emotionsChart.destroy();
      voiceChart.destroy();
    };
  }, [insights]);

  const lastInsight = insights[insights.length - 1];

  return (
    <div className="container p-0">
      <h4>Insights da Sessão</h4>

      {/* Cards rápidos */}
      {lastInsight && (
        <div className="row mb-3">
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <h6>Atenção</h6>
                <p className="fw-bold text-success">{lastInsight.attentionLevel}</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <h6>Postura</h6>
                <p className="fw-bold text-warning">{lastInsight.posture}</p>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card text-center">
              <div className="card-body">
                <h6>Engajamento</h6>
                <p className="fw-bold text-primary">{lastInsight.engagement}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="row">
        <div className="col-12 col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h6>Emoções</h6>
              <div id="emotionsChart"></div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 mb-3">
          <div className="card">
            <div className="card-body">
              <h6>Energia da voz</h6>
              <div id="voiceChart"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo textual */}
      {lastInsight && (
        <div className="card mt-3">
          <div className="card-body">
            <h6>Resumo</h6>
            <p>{lastInsight.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPanel;
