import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Chatbot from "../pages/Chatbot";
import CadastroDeMoto from "../pages/CadastroMoto";
import { MotoProvider } from "../context/MotoContext";

const Routers = () => {
    return (
        <BrowserRouter>
            <MotoProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                    <Route path="/cadastroMoto" element={<CadastroDeMoto/>} />
                </Routes>
            </MotoProvider>
        </BrowserRouter>
    );
}

export default Routers;