import React from 'react';
import { Box, Typography } from '@mui/material';

const TableHeader = () => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: '2fr 2.3fr 1.5fr 0.8fr auto',
      columnGap: 1,
      alignItems: 'center',
      width: '100%',
      px: { xs: 2, sm: 3 },
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

    <Box sx={{ display: 'flex', justifyContent: 'flex-start', minWidth: 0 }}>
      <Typography color="black" textAlign="left">
        Email
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center', minWidth: 0 }}>
      <Typography color="black" textAlign="center">
        Função
      </Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Typography color="black">Status</Typography>
    </Box>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Typography color="black">Ações</Typography>
    </Box>
  </Box>
);

export default TableHeader;
