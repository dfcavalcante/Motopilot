import React, { useContext } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BaseFront from '../utils/BaseFront.jsx';
import { MotoContext } from '../context/MotoContext.jsx';

const CadastroMotoAtribuir = () => {
  const navigate = useNavigate();
  const { criarMotoPai, loading } = useContext(MotoContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      marca: '',
      modelo: '',
    },
  });

  const onSubmit = async (data) => {
    const novoModelo = await criarMotoPai(data);
    if (!novoModelo) {
      toast.error('Não foi possível criar o modelo de moto.');
      return;
    }

    toast.success('MotoPai criada com sucesso!');
    navigate('/listagemMotos');
  };

  return (
    <BaseFront nome="Cadastro de MotoPai">
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: '#E0E0E0',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          maxWidth: '700px',
          width: '100%',
          mx: 'auto',
        }}
      >
        <Typography sx={{ fontSize: 26, fontWeight: 500, mb: 3 }}>Novo Modelo de Moto</Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Marca"
            {...register('marca', { required: 'A marca é obrigatória.' })}
            error={!!errors.marca}
            helperText={errors.marca?.message}
            fullWidth
            sx={{ backgroundColor: 'white', borderRadius: '10px' }}
          />

          <TextField
            label="Modelo"
            {...register('modelo', { required: 'O modelo é obrigatório.' })}
            error={!!errors.modelo}
            helperText={errors.modelo?.message}
            fullWidth
            sx={{ backgroundColor: 'white', borderRadius: '10px' }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              mt: 1,
              backgroundColor: '#666',
              color: 'white',
              borderRadius: '10px',
              textTransform: 'none',
              py: 1.2,
              '&:hover': { backgroundColor: '#4f4f4f' },
            }}
          >
            {loading ? 'Salvando...' : 'Criar MotoPai'}
          </Button>
        </Box>
      </Box>
    </BaseFront>
  );
};

export default CadastroMotoAtribuir;
