import React, { useState, useContext } from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import HeaderChatBot from '../components/ChatBot/HeaderChatbot.jsx';
import SideBar from '../components/SideBar.jsx';
import EtapasMoto from '../components/Motos/EtapasMoto.jsx';
import { MotoContext } from '../context/MotoContext.jsx';

import DadosGerais from '../components/Motos/DadosGerais.jsx';
import ManualMoto from '../components/Motos/DadosManual.jsx'; // Certifique-se que este é o arquivo com o PdfUploader
import Concluido from '../components/Motos/Concluido.jsx';

const CadastroDeMoto = () => {
  const { cadastrarMoto } = useContext(MotoContext);

  const [loading, setLoading] = useState(false);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [errors, setErrors] = useState({});

  const [dadosForm, setDadosForm] = useState({
    modelo: '',
    numeroSerie: '',
    marca: '',
    ano: '',
    descricao: '',
    estado: '',
    foto: null,
    manual_pdf_path: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setDadosForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validarCampos = (etapa) => {
    const novosErros = {};
    let ehValido = true;

    if (etapa === 1) {
      if (!dadosForm.modelo) novosErros.modelo = 'O modelo é obrigatório.';
      if (!dadosForm.marca) novosErros.marca = 'A marca é obrigatória.';
      if (!dadosForm.ano) novosErros.ano = 'O ano é obrigatório.';
      if (!dadosForm.numeroSerie) novosErros.numeroSerie = 'O número de série é obrigatório.';
      if (!dadosForm.foto) novosErros.foto = 'A foto da moto é obrigatória.';
    }

    if (Object.keys(novosErros).length > 0) {
      setErrors(novosErros);
      ehValido = false;
    }

    return ehValido;
  };

  const handleProximo = () => {
    if (validarCampos(1)) {
      setEtapaAtual((prev) => prev + 1);
    }
  };

  const handleVoltar = () => {
    setErrors({});
    setEtapaAtual((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleFinalSubmit = async (arquivoPdfDoFilho) => {
    console.log('--- INICIANDO ENVIO ---');
    console.log('Arquivo PDF recebido do filho:', arquivoPdfDoFilho);

    if (!arquivoPdfDoFilho) {
      setErrors({ manual_pdf_path: 'O manual (PDF) é obrigatório.' });
      return;
    }

    setLoading(true);
    const formData = new FormData();

    formData.append('marca', dadosForm.marca);
    formData.append('modelo', dadosForm.modelo);
    formData.append('ano', dadosForm.ano);
    formData.append('numeroSerie', dadosForm.numeroSerie);
    formData.append('descricao', dadosForm.descricao || '');

    if (dadosForm.foto) {
      formData.append('imagem_moto', dadosForm.foto);
    } else {
      console.error('ERRO: Foto está nula no state');
      alert('Erro: A foto da moto é obrigatória');
      setLoading(false);
      return;
    }

    formData.append('documento_pdf', arquivoPdfDoFilho);

    console.log('Conteúdo do FormData a ser enviado:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      setDadosForm((prev) => ({ ...prev, manual_pdf_path: arquivoPdfDoFilho }));

      const sucesso = await cadastrarMoto(formData);

      console.log('Resposta do cadastrarMoto:', sucesso);

      if (sucesso) {
        setEtapaAtual(3);
      } else {
        alert(
          'O Backend rejeitou os dados. Verifique o Console (F12) -> Network para ver o erro vermelho.'
        );
      }
    } catch (error) {
      console.error('Erro CRÍTICO ao enviar:', error);
      alert('Erro de conexão ou código.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#989898',
        p: '16px',
        boxSizing: 'border-box',
      }}
    >
      <SideBar />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: '24px', height: '100%' }}
      >
        <Stack spacing="8px" sx={{ height: '100%' }}>
          <Box sx={{ flexShrink: 0 }}>
            {' '}
            <HeaderChatBot />{' '}
          </Box>

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
            <Typography variant="h5" mb={2}>
              Adicionar Moto
            </Typography>
            <Divider sx={{ width: '90%', bgcolor: 'grey.500', height: '0.4px', mb: 2 }} />

            <EtapasMoto etapa={etapaAtual} />

            <Box sx={{ width: '100%', flex: 1, overflowY: 'auto', mt: 2 }}>
              {etapaAtual === 1 && (
                <DadosGerais
                  dados={dadosForm}
                  handleChange={handleChange}
                  onNext={handleProximo}
                  errors={errors}
                />
              )}

              {etapaAtual === 2 && (
                <ManualMoto
                  dados={dadosForm}
                  handleChange={handleChange}
                  onBack={handleVoltar}
                  onNext={(arquivo) => handleFinalSubmit(arquivo)}
                  loading={loading}
                  errors={errors}
                />
              )}

              {etapaAtual === 3 && <Concluido />}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CadastroDeMoto;
