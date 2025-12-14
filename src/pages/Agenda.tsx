import React, { useState } from "react";
import MasterPage from "../layout/MasterPage";

type Consulta = {
  id: number;
  paciente: string;
  psicologo: string;
  data: string;
  hora: string;
};

const Agenda = () => {
  const [consultas] = useState<Consulta[]>([
    { id: 1, paciente: "João Silva", psicologo: "Dra. Maria", data: "12/12/2025", hora: "14:00" },
    { id: 2, paciente: "Ana Souza", psicologo: "Dr. Carlos", data: "13/12/2025", hora: "10:00" },
  ]);

  return (
    <MasterPage>
      <div className="container mt-4">
        <h2 className="mb-4">Agenda</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Paciente</th>
              <th>Psicólogo</th>
              <th>Data</th>
              <th>Hora</th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((c) => (
              <tr key={c.id}>
                <td>{c.paciente}</td>
                <td>{c.psicologo}</td>
                <td>{c.data}</td>
                <td>{c.hora}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MasterPage>
  );
};

export default Agenda;
