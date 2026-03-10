import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const BoxRelatorio = ({ icone, numero, nome, descricao }) => {
  return (
    <Box
      minWidth={200}
      height={'100%'}
      backgroundColor={'#ffffff'}
      borderRadius={4}
      padding={4}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="space-between"
      gap={4}
    >
      {/* Container do Ícone com fundo cinza */}
      <Box
        backgroundColor="#E4E4E4"
        padding={1.5}
        borderRadius={3}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width={60}
        height={60}
      >
        {icone}
      </Box>

      {/* Número com bastante destaque */}
      <Typography fontSize={50} fontWeight="600" color="#000000" lineHeight={1}>
        {numero}
      </Typography>

      {/* Grupo de Textos Inferiores (Nome e Descrição) juntos */}
      <Stack direction="column" alignItems="center" spacing={1} width="100%">
        <Typography fontSize={13} fontWeight="500" textAlign="center" color="#1A1A1A">
          {nome}
        </Typography>

        <Typography fontSize={11}  color="#808080" textAlign="center">
          {descricao}
        </Typography>
      </Stack>
    </Box>
  );
};

{
  /*Componente do Dashboard para mostrar os relatórios*/
}
const RelatoriosDashboards = () => {
  const relatorios = [
    {
      icone: (
        <img
          src="/images/RelatorioPronto.png"
          alt="Ícone"
          width={30}
          height={30}
          style={{ objectFit: 'contain' }}
        />
      ),
      numero: 348,
      nome: 'Relatórios Concluídos',
      descricao: 'Taxa de conclusão: 87,2%',
    },
    {
      icone: (
        <img
          src="/images/RelatorioPendente.png"
          alt="Ícone"
          width={30}
          height={30}
          style={{ objectFit: 'contain' }}
        />
      ),
      numero: 52,
      nome: 'Relatórios Pendentes',
      descricao: 'Aguardando Revisão',
    },
    {
      icone: (
        <img
          src="/images/RelatorioConcluido.png"
          alt="Ícone"
          width={30}
          height={30}
          style={{ objectFit: 'contain' }}
        />
      ),
      numero: 400,
      nome: 'Relatórios Totais',
      descricao: 'Taxa de conclusão: 87,2%',
    },
  ];

  return (
    <Box
      backgroundColor={'#D9D9D9'}
      width="100%"
      height="100%"
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
      borderRadius={4}
      padding={1}
    >
      <Box justifyContent={'center'} display={'flex'} flexDirection={'row'} gap={2}>
        {relatorios.map((relatorio, index) => (
          <BoxRelatorio
            key={index} 
            icone={relatorio.icone}
            numero={relatorio.numero}
            nome={relatorio.nome}
            descricao={relatorio.descricao}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RelatoriosDashboards;
