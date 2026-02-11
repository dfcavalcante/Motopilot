import React, { useState } from 'react';
import { Box, Stack, Divider, Typography } from '@mui/material';
import SideBar from '../components/SideBar';
import HeaderChatBot from '../components/ChatBot/HeaderChatbot';
import DadosPessoais from '../components/Usuários/DadosPessoais';
import Etapas from '../components/Usuários/Etapas';
import CriarSenha from '../components/Usuários/CriarSenha';
import Concluido from '../components/Usuários/Concluido';
import { UsersContext } from '../context/UserContext';

const Cadastro = () => {
  const [nomeCompleto, setNomeCompleto] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [numeroMatricula, setNumeroMatricula] = React.useState('');
  const [funcao, setFuncao] = React.useState('');
  const [etapa, setEtapa] = React.useState(1);

  const { cadastrarUser } = React.useContext(UsersContext);

  const proximaEtapa = () => setEtapa((prev) => prev + 1);
  const etapaAnterior = () => setEtapa((prev) => prev - 1);

  const finalizarCadastro = async (senha) => {
    const novoUsuario = {
      nome: nomeCompleto,
      email: email,
      matricula: numeroMatricula,
      funcao: funcao,
      senha: senha,
    };

    const sucesso = await cadastrarUser(novoUsuario);
    if (sucesso) {
      setEtapa(3);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        bgcolor: '#989898',
        p: '16px',
        boxSizing: 'border-box',
      }}
    >
      <SideBar />

      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '20px', height: '100%' }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
          <Box sx={{ flexShrink: 0 }}>
            <HeaderChatBot />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              bgcolor: 'white',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 4,
              overflow: 'hidden',
            }}
          >
            <Box display={'flex'} mb={2} alignItems="center" gap={2}>
              <img src="/images/adicionarUsuario.png" alt="Usuários" width="22" height={22} />
              <Typography fontSize={30}> Adicionar Usuário</Typography>
            </Box>
            <Divider sx={{ width: '90%', bgcolor: 'grey.700', height: '0.4px', mb: 2 }} />

            {/* O componente de Etapas recebe o número atual para pintar a bolinha certa */}
            <Etapas etapa={etapa} />

            {/* LÓGICA DE TROCA DE ETAPAS */}
            {etapa === 1 && (
              <DadosPessoais
                nomeCompleto={nomeCompleto}
                setNomeCompleto={setNomeCompleto}
                email={email}
                setEmail={setEmail}
                numeroMatricula={numeroMatricula}
                setNumeroMatricula={setNumeroMatricula}
                funcao={funcao}
                setFuncao={setFuncao}
                onBack={etapaAnterior}
                onNext={proximaEtapa}
              />
            )}

            {etapa === 2 && (
              <CriarSenha
                onBack={etapaAnterior}
                onNext={proximaEtapa}
                onSubmit={(senha) => finalizarCadastro(senha)}
              />
            )}

            {etapa === 3 && <Concluido />}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Cadastro;
