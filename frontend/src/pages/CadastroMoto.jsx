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
    modeloPaiSelecionado,
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
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmitForm)}
          sx={{ width: '100%', flex: 1, mt: 2 }}
        >
          {etapaAtual === 1 && (
            <DadosGerais
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
              modeloPaiSelecionado={modeloPaiSelecionado}
            />
          )}

          {etapaAtual === 2 && <Concluido />}
        </Box>
      </Box>
    </BaseFront>
  );
};

export default CadastroDeMoto;
