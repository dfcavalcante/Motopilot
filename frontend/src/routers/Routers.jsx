import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Chatbot from "../pages/Chatbot";
import Relatorio from "../pages/Relatorio";
import HistoricoRelatorios from "../pages/HistoricoRelatorios";
import CadastroDeMoto from "../pages/CadastroMoto";
import { MotoProvider } from "../context/MotoContext";
import { RelatorioProvider } from "../context/RelatorioContext";

const Routers = () => {
    return (
        <BrowserRouter>
            <MotoProvider>
                <RelatorioProvider>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/chatbot" element={<Chatbot />} />
                        <Route path="/cadastroMoto" element={<CadastroDeMoto/>} />
                        <Route path="/relatorio" element={<Relatorio/>} />
                        <Route path="/historicoRelatorios" element={<HistoricoRelatorios />} />
                    </Routes>   
                </RelatorioProvider>
            </MotoProvider>
        </BrowserRouter>
    );
}

export default Routers;