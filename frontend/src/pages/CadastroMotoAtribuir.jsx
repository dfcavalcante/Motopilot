import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseFront from '../utils/BaseFront.jsx';
import { MotoContext } from '../context/MotoContext.jsx';
import ImageUploader from './../components/Motos/ImageUploader';
import EtapasMoto from '../components/Motos/EtapasMoto.jsx';
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

  const labelStyle = {
    color: '#000000',
    fontSize: '15px',
    fontWeight: '500',
    marginLeft: '2px',
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
      borderRadius: '12px',
      '& fieldset': { borderColor: '#A0A0A0' },
      '&:hover fieldset': { borderColor: '#666' },
      '&.Mui-focused fieldset': { borderColor: '#666', borderWidth: '1px' },
    },
    '& input': {
      padding: '10px 14px',
      fontSize: '0.9rem',
    },
  };

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
    <BaseFront nome="Cadastro de Modelo">
      <Box
        sx={{
          backgroundColor: '#E0E0E0',
          pl: 16,
          pr: 16,
          pt: 4,
          pb: 4,
          borderRadius: '16px',
          width: '100%',
          maxWidth: '1300px',
          margin: '0 auto',
          fontFamily: 'Roboto, sans-serif',
          overflow: 'visible',
        }}
      >
        <EtapasMoto etapa={etapaAtual} />

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', mt: 2 }}>
          
          {etapaAtual === 1 && (
            <>
              <Typography variant="h5" align="center" sx={{ mb: 4, color: '#000000', fontWeight: 400 }}>
                Dados Gerais
              </Typography>

        <Grid container spacing={4}>
          {/* LADO ESQUERDO: FOTO */}
          <Grid>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <ImageUploader
                arquivo={watch('imagem_moto')}
                onFileSelect={(file) => setValue('imagem_moto', file, { shouldValidate: true })}
              />

              {errors.imagem_moto && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, textAlign: 'center', fontSize: '0.9rem' }}
                >
                  {errors.imagem_moto.message}
                </Typography>
              )}
            </Box>
          </Grid>

          {/* LADO DIREITO: INPUTS */}
          <Stack spacing={1} sx={{ height: '100%', width: '25%', ml: 5 }}>
            <Typography sx={labelStyle}>Modelo</Typography>
            <TextField
              {...register('modelo')}
              fullWidth
              placeholder="Inserir nome"
              variant="outlined"
              sx={inputSx}
              error={!!errors.modelo}
              helperText={errors.modelo?.message}
            />
          </Stack>

          <Stack spacing={1} sx={{ height: '100%', width: '25%', ml: 5 }}>
            <Typography sx={labelStyle}>Marca</Typography>
            <TextField
              {...register('marca')}
              fullWidth
              placeholder="Inserir Marca"
              variant="outlined"
              sx={inputSx}
              error={!!errors.marca}
              helperText={errors.marca?.message}
            />

            <Typography sx={labelStyle}>Ano</Typography>
            <TextField
              {...register('ano')}
              fullWidth
              placeholder="YYYY"
              variant="outlined"
              sx={inputSx}
              error={!!errors.ano}
              helperText={errors.ano?.message}
            />
          </Stack>
        </Grid>

        {/* RODAPÉ: BOTÕES */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
          <Button
            onClick={() =>navigate('/listagemMotos')}
            variant="outlined"
            sx={{
              color: '#333',
              borderColor: '#999',
              borderRadius: '8px',
              textTransform: 'none',
              px: 4,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleProximo}
            variant="contained"
            sx={{
              backgroundColor: '#666',
              color: 'white',
              borderRadius: '8px',
              textTransform: 'none',
              px: 4,
              '&:hover': { backgroundColor: '#444' },
            }}
          >
            Próximo
          </Button>
        </Box>
        </>
      )}

      {etapaAtual === 2 && (
        <ManualMoto
          setValue={setValue}
          watch={watch}
          onBack={() => setEtapaAtual(1)}
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
