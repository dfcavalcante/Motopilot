import React from "react";
import { Box, Typography } from "@mui/material";

const TableHeader = () => (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        mt: 3,
        mb: 2,
        borderBottom: '1px dashed #969696',
        pb: 2, 
      }}
    >
      <Box sx={{ width: '25%' }}>
        <Typography color="black">Funcionário</Typography>
      </Box>

      <Box sx={{ width: '25%', alignContent: 'flex-end' }}>
        <Typography color="black">Email</Typography>
      </Box>

      <Box sx={{ width: '20%' }}>
        <Typography color="black">Função</Typography>
      </Box>

      <Box sx={{ width: '20%', textAlign: 'center' }}>
        <Typography color="black">Status</Typography>
      </Box>

      <Box sx={{ width: '3.5%', textAlign: 'right' }}>
        <Typography color="black">Ações</Typography>
      </Box>
    </Box>
  );

  export default TableHeader;