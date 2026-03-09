import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const BoxRelatorio = ({ icone, numero, nome, descricao }) => {
  return (
    <Box width={210} height={300} backgroundColor={'#ffffff'} borderRadius={4}>
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        gap={3}
        padding={2}
      >
        <Typography width={25} height={30}>
          {icone}
        </Typography>

        <Typography fontSize={35} fontWeight="bold" variant="body-2" marginBottom={4}>
          {numero}
        </Typography>

        <Typography fontSize={15} variant="body-1">
          {nome}
        </Typography>

        <Typography fontSize={15} variant="body-2" color="#00000080">
          {descricao}
        </Typography>
      </Stack>
    </Box>
  );
};

{
  /*Componente do Dashboard para mostrar as peças defeituosas*/
}
const RelatoriosDashboards = () => {
  //dps vem o context das peças aq quando tiver o backend
  const relatorios = [
    {
      icone: <img src="/images/RelatorioPronto.png" alt="Ícone" width={40} height={25} />,
      numero: 348,
      nome: 'Relatórios Concluídos',
      descricao: 'Taxa de conclusão: 87,2%',
    },
    {
      icone: <img src="/images/RelatorioPendente.png" alt="Ícone" width={40} height={25} />,
      numero: 52,
      nome: 'Relatórios Pendentes',
      descricao: 'Aguardando Revisão',
    },
    {
      icone: <img src="/images/RelatorioConcluido.png" alt="Ícone" width={40} height={25} />,
      numero: 400,
      nome: 'Relatórios Totais',
      descricao: 'Taxa de conclusão: 87,2%',
    },
  ];

  return (
    <Box
      backgroundColor={'#D9D9D9'}
      width={730}
      height={340}
      alignItems={'center'}
      display={'flex'}
      flexDirection={'column'}
      borderRadius={4}
    >
      <Box justifyContent={'center'} display={'flex'} flexDirection={'row'} gap={2} marginTop={2}>
        {relatorios.map((relatorio) => (
          <BoxRelatorio
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
