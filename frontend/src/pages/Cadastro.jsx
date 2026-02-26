import React from 'react';
import { Box } from '@mui/material';
import BaseFront from '../utils/BaseFront';
import DadosPessoais from '../components/Usuários/DadosPessoais';
import Etapas from '../components/Usuários/Etapas';
import CriarSenha from '../components/Usuários/CriarSenha';
import Concluido from '../components/Usuários/Concluido';
import { HookUsers } from '../hooks/HookUsers';

const Cadastro = () => {
  const {
    etapaAtual,
    loading,
    errors,
    register,
    watch,
    handleProximo,
    handleVoltar,
    onSubmitForm,
    handleSubmit,
    control,
  } = HookUsers();

  return (
    <BaseFront
      icone="/images/adicionarUsuario.png"
      width="22"
      height={22}
      nome={'Adicionar Usuários'}
    >
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'white',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
          overflow: 'hidden',
        }}
      >
        <Etapas etapa={etapaAtual} />

        <form
          onSubmit={handleSubmit(onSubmitForm)}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          {etapaAtual === 1 && (
            <DadosPessoais
              register={register}
              errors={errors}
              onNext={handleProximo}
              loading={loading}
              control={control}
            />
          )}

          {etapaAtual === 2 && (
            <CriarSenha
              register={register}
              errors={errors}
              watch={watch}
              onBack={handleVoltar}
              loading={loading}
            />
          )}

          {etapaAtual === 3 && <Concluido />}
        </form>
      </Box>
    </BaseFront>
  );
};

export default Cadastro;
