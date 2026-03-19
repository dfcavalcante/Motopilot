import React from 'react';
import { Box, Typography } from '@mui/material';

const TableHeader = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      mt: 3,
      mb: 2,
      borderBottom: '1px dashed #969696',
      pb: 2,
    }}
  >
    <Box
      sx={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}
    >
      <Box sx={{ width: 32, height: 32, visibility: 'hidden' }} />
      <Typography color="black">Funcionário</Typography>
    </Box>

    <Box sx={{ width: '25%', display: 'flex', justifyContent: 'center' }}>
      <Typography color="black" textAlign="center">
        Email
      </Typography>
    </Box>

    <Box sx={{ width: '20%', display: 'flex', justifyContent: 'center' }}>
      <Typography color="black" textAlign="center">
        Função
      </Typography>
    </Box>

    <Box sx={{ width: '20%', textAlign: 'center' }}>
      <Typography color="black">Status</Typography>
    </Box>

    <Box sx={{ width: '8%', display: 'flex', justifyContent: 'flex-end' }}>
      <Typography color="black">Ações</Typography>
    </Box>
  </Box>
);

export default TableHeader;
