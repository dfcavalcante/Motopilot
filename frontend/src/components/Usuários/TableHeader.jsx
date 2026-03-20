import React from 'react';
import { Box, Typography } from '@mui/material';

const TableHeader = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '2.2fr 2.2fr 1.5fr 1fr auto',
      columnGap: 2,
      alignItems: 'center',
      width: '100%',
      px: 2,
      mt: 3,
      mb: 2,
      borderBottom: '1px dashed #969696',
      pb: 2,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
      <Box sx={{ width: 32, height: 32, visibility: 'hidden' }} />
      <Typography color="black">Funcionário</Typography>
    </Box>

    <Box sx={{ display: 'flex', minWidth: 0 }}>
      <Typography color="black" textAlign="left">
        Email
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', minWidth: 0 }}>
      <Typography color="black" textAlign="left">
        Função
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Typography color="black">Status</Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography color="black">Ações</Typography>
    </Box>
  </Box>
);

export default TableHeader;
