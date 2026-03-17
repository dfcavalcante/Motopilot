import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Chatbot from '../pages/Chatbot';
import CadastroDeMoto from '../pages/CadastroMoto';
import Cadastro from '../pages/Cadastro';
import Usuarios from '../pages/Usuarios';
import ListagemMotos from '../pages/ListagemMotos';
import Notificacoes from '../pages/Notificacoes';
import Dashboard from '../pages/Dashboard';
import Relatorio from '../pages/HistoricoRelatorios';
import Graficos from '../pages/Graficos';

// Importação dos Contextos
import { MotoProvider } from '../context/MotoContext';
import { UsersProvider } from '../context/UserContext';
import { NotificacaoProvider } from '../context/NotificacoesContext';
import { ChatProvider } from '../context/ChatContext';
import { LoginProvider } from '../context/LoginContext';
import { ReportProvider } from '../context/ReportContext';
import { PecaProvider } from '../context/PecasContext';
import { GraficoProvider } from '../context/GraficosContext';

import RotaProtegida from './RoutersProtected';

const Routers = () => {
  return (
    <BrowserRouter>
      <MotoProvider>
        <GraficoProvider>
          <UsersProvider>
            <ChatProvider>
              <PecaProvider>
                <LoginProvider>
                  <NotificacaoProvider>
                    <ReportProvider>
                      <Routes>
                        {/* ROTA PÚBLICA */}
                        <Route path="/" element={<Login />} />

                        {/* ROTAS PROTEGIDAS */}
                        <Route
                          path="/chatbot"
                          element={
                            <RotaProtegida>
                              <Chatbot />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/cadastroMoto"
                          element={
                            <RotaProtegida>
                              <CadastroDeMoto />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/listagemMotos"
                          element={
                            <RotaProtegida>
                              <ListagemMotos />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/cadastro"
                          element={
                            <RotaProtegida>
                              <Cadastro />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/usuarios"
                          element={
                            <RotaProtegida>
                              <Usuarios />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/notificacoes"
                          element={
                            <RotaProtegida>
                              <Notificacoes />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/dashboard"
                          element={
                            <RotaProtegida>
                              <Dashboard />
                            </RotaProtegida>
                          }
                        />
                        <Route
                          path="/relatorios"
                          element={
                            <RotaProtegida>
                              <Relatorio />
                            </RotaProtegida>
                          }
                        />

                        <Route
                          path="/graficos"
                          element={
                            <RotaProtegida>
                              <Graficos />
                            </RotaProtegida>
                          }
                        />
                      </Routes>
                    </ReportProvider>
                  </NotificacaoProvider>
                </LoginProvider>
              </PecaProvider>
            </ChatProvider>
          </UsersProvider>
        </GraficoProvider>
      </MotoProvider>
    </BrowserRouter>
  );
};

export default Routers;
