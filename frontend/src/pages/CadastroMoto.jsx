import React from 'react';
import { Box } from '@mui/material';
import BaseFront from '../utils/BaseFront.jsx';
import EtapasMoto from '../components/Motos/EtapasMoto.jsx';
import HookCadastroMoto from '../hooks/HookCadastroMoto.jsx';

import DadosGerais from '../components/Motos/DadosGerais.jsx';
import ManualMoto from '../components/Motos/DadosManual.jsx';
import Concluido from '../components/Motos/Concluido.jsx';

const CadastroDeMoto = () => {
  const {
    etapaAtual,
    loading,
    errors,
    register,
    setValue,
    watch,
    handleSubmit,
    onSubmitForm,
    handleProximo,
    handleVoltar,
  } = HookCadastroMoto();

  return (
    <BaseFront nome="Cadastro de moto">
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
        <EtapasMoto etapa={etapaAtual} />

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitForm)}
          sx={{ width: '100%', flex: 1, overflowY: 'hidden', mt: 2 }}
        >
          {etapaAtual === 1 && (
            <DadosGerais
              register={register}
              setValue={setValue} // Usado para o upload da foto
              errors={errors} //Mensagens de erro do Zod
              onNext={handleProximo}
              watch={watch}
            />
          )}

          {etapaAtual === 2 && (
            <ManualMoto
              setValue={setValue} // Usado para o upload do PDF
              errors={errors}
              onBack={handleVoltar}
              loading={loading}
              watch={watch}
            />
          )}

          {etapaAtual === 3 && <Concluido />}
        </Box>
      </Box>
    </BaseFront>
  );
};

export default CadastroDeMoto;
