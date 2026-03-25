import React from 'react';
import { Box, Stack, Typography } from '@mui/material';

const BoxDashboard = ({ icone, titulo, descricao, numero }) => {
  return (
    <Box
      width="100%" 
      height="100%"
      borderRadius={4}
      p={2}
      display="flex"
      flexDirection="row"
      alignItems="flex-start"
      justifyContent="center"
      boxSizing="border-box"
      border={'1.3px solid #E0E0E0'}
    >
      <Box sx={{ flex: 1, minWidth: 0, marginLeft: 2 }}>
        {/*Icone e número um do lado do outro*/}
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Box
            bgcolor="#D9D9D9"
            height={40}
            width={40}
            padding={3}
            borderRadius={2}
            marginBottom={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography fontSize={20} variant="body-1" lineHeight={1}>
              {icone}
            </Typography>
          </Box>

          <Typography fontSize={32} variant="body-2" fontWeight={600}>
            {numero}
          </Typography>
        </Stack>

        {/*Titulo e descrição um embaixo do outro*/}
        <Stack direction="column" alignItems="flex-start" justifyContent="space-between" gap={1}>
          <Typography
            fontSize={20}
            variant="body-1"
            marginBottom={1}
            noWrap 
          >
            {titulo}
          </Typography>

          <Typography fontSize={14} variant="body-2" color="#00000080" noWrap>
            {descricao}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default BoxDashboard;
