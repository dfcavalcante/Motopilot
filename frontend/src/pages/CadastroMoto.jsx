import React from 'react';
import { Box } from '@mui/material';
import BaseFront from '../utils/BaseFront.jsx';
import EtapasMotoIndividual from '../components/Motos/EtapaMotoIndividual.jsx';
import HookCadastroMoto from '../hooks/HookCadastroMoto.jsx';

import DadosGerais from '../components/Motos/DadosGerais.jsx';
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
    modeloPaiSelecionado,
  } = HookCadastroMoto();

  return (
    <BaseFront nome="Adicionar moto">
      <EtapasMotoIndividual etapa={etapaAtual} />
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: 'white',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmitForm)} sx={{ width: '100%', flex: 1 }}>
          {etapaAtual === 1 && (
            <DadosGerais
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
              modeloPaiSelecionado={modeloPaiSelecionado}
              onNext={handleProximo}
              onBack={handleVoltar}
            />
          )}

          {etapaAtual === 2 && <Concluido />}
        </Box>
      </Box>
    </BaseFront>
  );
};

export default CadastroDeMoto;
