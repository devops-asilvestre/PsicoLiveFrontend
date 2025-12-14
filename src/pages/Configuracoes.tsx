import React from "react";
import MasterPage from "../layout/MasterPage";

const Configuracoes = () => {
  return (
    <MasterPage>
      <div className="container mt-4">
        <h2 className="mb-4">Configurações da Clínica</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Nome da Clínica</label>
            <input type="text" className="form-control" placeholder="Digite o nome" />
          </div>
          <div className="mb-3">
            <label className="form-label">Endereço</label>
            <input type="text" className="form-control" placeholder="Digite o endereço" />
          </div>
          <button type="submit" className="btn btn-success">Salvar</button>
        </form>
      </div>
    </MasterPage>
  );
};

export default Configuracoes;
