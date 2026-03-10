import React from 'react';
import { Box, TextField, Typography, Select } from '@mui/material';
import BaseFront from '../utils/BaseFront';

const Relatorio= () => {
  const status = ['Equipamento operacional', 'Operacional com restrições', 'Inoperante'];
  const [statusSelecionado, setStatusSelecionado] = React.useState('');

  const handleStatusChange = (event) => {
    setStatusSelecionado(event.target.value);
  };

  return (
    <BaseFront nome={'Relatórios'}>
      <Box sx={{ width: '100%', overflowY: 'auto', pb: 2 }}>

        <Typography fontSize={24} fontWeight="600" marginBottom={2}>
          Capa/Cabeçalho
        </Typography>
        <TextField
          label="Empresa"
          variant="outlined"
          fullWidth
          helperText="Nome da empresa"
        />

        <TextField
          label="Número Relatório"
          helperText="Exemplo: N*: [001|Ano]"
          variant="outlined"
          fullWidth
        />

        <TextField
          label="Técnico Responsável"
          variant="outlined"
          helperText="Nome do profissional"
          fullWidth
        />

        <Typography fontSize={24} fontWeight="600" marginBottom={2} marginTop={4}>
          Identificação do Equipamento
        </Typography>
        <TextField
          label="Equipamento"
          variant="outlined"
          helperText="Ex: Redutor de velocidade, Motor, Bomba, etc"
          fullWidth
        />

        <TextField
          label="Marca/Modelo (A IA q vai fazer)"
          variant="outlined"
          helperText="Ex: Marca X, Modelo Y"
          fullWidth
        />

        <Typography fontSize={24} fontWeight="600" marginBottom={2} marginTop={4}>
          Descrição das atividades (Corpo do Relatório)
        </Typography>
        <TextField
          label="Situação encontrada (Diagnóstico)"
          variant="outlined"
          fullWidth
          helperText="Descrever o estado da máquina ao chegar. Ex: Rolamento traseiro com ruído elevado e temperatura de 85*C"
        />

        <TextField
          label="Serviços realizados"
          variant="outlined"
          fullWidth
          helperText="Descrever o passo a passo. Ex: Desmontagem, limpeza, substituição de rolamentos, trocaa de retentor, lubrificação e testes"
        />

        <TextField
          label="Peças utilizadas"
          variant="outlined"
          fullWidth
          helperText=""
        />

        <Typography fontSize={24} fontWeight="600" marginBottom={2} marginTop={4}>
          Evidências (Fotos)
        </Typography>
        <TextField
          label="Link para fotos"
          variant="outlined"
          fullWidth
          helperText="Ex: Link do Google Drive ou Dropbox"
        />

        <Typography fontSize={24} fontWeight="600" marginBottom={2} marginTop={4}>
          Conclusões e observações
        </Typography>


        <Select
          label="Status"
          variant="outlined"
          fullWidth
          helperText="Ex: Equipamento operacional/ Operacional com restrições / Inoperante"
          value={statusSelecionado}
          onChange={handleStatusChange}
        >
          {status.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <TextField
          label="Recomendações (Talvez tenha, e se tiver vai ser a IA q vai sugerir)"
          variant="outlined"
          fullWidth
          helperText="Ex: Monitoramento mensal recomendado, Substituição de rolamentos em 6 meses, etc"
        />

      </Box>
    </BaseFront>
  );
};

export default Relatorio;
