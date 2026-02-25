import React, { useState } from 'react';
import { Box, Stack, Divider, Typography } from '@mui/material';
import BaseFront from '../utils/BaseFront';
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
    <BaseFront
      icone="/images/adicionarUsuario.png"
      width="22"
      height={22}
      nome={'Adicionar Usuários'}
    >
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
    </BaseFront>
  );
};

export default Cadastro;
