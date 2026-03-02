import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Chatbot from '../pages/Chatbot';
import CadastroDeMoto from '../pages/CadastroMoto';
import Cadastro from '../pages/Cadastro';
import Usuarios from '../pages/Usuarios';
import ListagemMotos from '../pages/ListagemMotos';
import Notificacoes from '../pages/Notificacoes';
import { MotoProvider } from '../context/MotoContext';
import { UsersProvider } from '../context/UserContext';

const Routers = () => {
  return (
    <BrowserRouter>
      <MotoProvider>
        <UsersProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/cadastroMoto" element={<CadastroDeMoto />} />
            <Route path="/listagemMotos" element={<ListagemMotos />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/notificacoes" element={<Notificacoes />} />
          </Routes>
        </UsersProvider>
      </MotoProvider>
    </BrowserRouter>
  );
};

export default Routers;
