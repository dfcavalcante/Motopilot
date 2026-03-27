import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseFront from '../utils/BaseFront.jsx';
import { MotoContext } from '../context/MotoContext.jsx';
import EtapasMoto from '../components/Motos/EtapasMoto.jsx';
import DadosGeraisModelo from '../components/Motos/DadosGeraisModelo.jsx';
import ManualMoto from '../components/Motos/DadosManual.jsx';
import Concluido from '../components/Motos/Concluido.jsx';

const CadastroMotoAtribuir = () => {
  const navigate = useNavigate();
  const { criarMotoPai, loading } = useContext(MotoContext);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      marca: '',
      modelo: '',
      ano: '',
      imagem_moto: null,
      manual_pdf_path: null,
    },
  });

  const [etapaAtual, setEtapaAtual] = useState(1);

  useEffect(() => {
    register('imagem_moto', { required: 'A foto da moto pai é obrigatória.' });
  }, [register]);

  const imagemSelecionada = watch('imagem_moto');

  const handleProximo = async () => {
    const valid = await trigger(['marca', 'modelo', 'ano', 'imagem_moto']);
    if (valid) setEtapaAtual(2);
  };

  const onSubmit = async (data) => {
    const novoModelo = await criarMotoPai(data);
    if (!novoModelo) {
      toast.error('Não foi possível criar o modelo de moto.');
      return;
    }

    toast.success('MotoPai criada com sucesso!');
    setEtapaAtual(3);
  };

  return (
    <BaseFront nome="Adicionar Modelo">
      <EtapasMoto etapa={etapaAtual} />

      <Box
        sx={{
          p: { xs: 2, md: 4 },
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1000px',
          minHeight: 400,
          margin: '0 auto',
          fontFamily: 'Roboto, sans-serif',
          overflow: 'visible',
          marginTop: 4,
        }}
      >
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', mt: 2 }}>
          {etapaAtual === 1 && (
            <DadosGeraisModelo
              register={register}
              setValue={setValue}
              errors={errors}
              watch={watch}
              onNext={handleProximo}
              onCancel={() => navigate(-1)}
              modeloPaiSelecionado={null}
            />
          )}

          {etapaAtual === 2 && (
            <ManualMoto
              setValue={setValue}
              watch={watch}
              onBack={() => setEtapaAtual(1)}
              onNext={handleProximo}
              loading={loading}
            />
          )}

          {etapaAtual === 3 && <Concluido />}
        </Box>
      </Box>
    </BaseFront>
  );
};

export default CadastroMotoAtribuir;
