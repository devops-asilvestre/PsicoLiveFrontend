import React, { useEffect } from "react";
import ApexCharts from "apexcharts/dist/apexcharts.min.js";

type EmotionPoint = { time: string; alegria: number; tristeza: number; ansiedade: number };

type InsightsPanelProps = {
  emotionTimeline: EmotionPoint[];
  voiceEnergy: number[];
  quickIndicators: { attention: string; posture: string; engagement: string };
  summary: string;
};

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  emotionTimeline,
  voiceEnergy,
  quickIndicators,
  summary,
}) => {
  useEffect(() => {
    const categories = emotionTimeline.map((p) => p.time);
    const seriesEmotions = [
      { name: "Alegria", data: emotionTimeline.map((p) => p.alegria) },
      { name: "Tristeza", data: emotionTimeline.map((p) => p.tristeza) },
      { name: "Ansiedade", data: emotionTimeline.map((p) => p.ansiedade) },
    ];

    const emotionsOptions = {
      chart: { type: "line", height: "100%", width: "100%" },
      series: seriesEmotions,
      xaxis: { categories },
      responsive: [{ breakpoint: 768, options: { chart: { height: 250 } } }],
    };
    const emotionsChart = new ApexCharts(document.querySelector("#emotionsChart"), emotionsOptions);
    emotionsChart.render();

    const voiceOptions = {
      chart: { type: "bar", height: "100%", width: "100%" },
      series: [{ name: "Energia da voz", data: voiceEnergy }],
      xaxis: { categories: ["Início", "5min", "10min", "15min", "20min"] },
      responsive: [{ breakpoint: 768, options: { chart: { height: 250 } } }],
    };
    const voiceChart = new ApexCharts(document.querySelector("#voiceChart"), voiceOptions);
    voiceChart.render();

    return () => {
      emotionsChart.destroy();
      voiceChart.destroy();
    };
  }, [emotionTimeline, voiceEnergy]);

  return (
    <div className="container p-0">
      <h4 className="mb-3">Insights da Sessão</h4>

      {/* Cards rápidos */}
      <div className="row mb-3">
        <div className="col-12 col-sm-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h6>Atenção</h6>
              <p className="fw-bold text-success">{quickIndicators.attention}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h6>Postura</h6>
              <p className="fw-bold text-warning">{quickIndicators.posture}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4 mb-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h6>Engajamento</h6>
              <p className="fw-bold text-primary">{quickIndicators.engagement}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="row">
        <div className="col-12 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h6>Emoções ao longo da sessão</h6>
              <div id="emotionsChart"></div>
            </div>
          </div>
        </div>
        <div className="col-12 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h6>Tom da voz</h6>
              <div id="voiceChart"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo textual */}
      <div className="card">
        <div className="card-body">
          <h6>Resumo</h6>
          <p>{summary}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
