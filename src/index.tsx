// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Import opcional de estilos globais (CSS)
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
